import React from 'react';
import '../App.css';
import CustomerFoodItem from '../components/CustomerFoodItem';
import CategoryCustomer from '../components/CategoryCustomer';
import makeRequest from '../makeRequest';
import { Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';

/**
 * Represents the Customer Menu Page in the customer interface.
 * @param {Object} props - The props passed to the component.
 * @param {Array} props.personas - The list of personas available for selection.
 * @param {function} props.handleExcludeCategories - The callback function to handle excluding categories.
 * @param {number} props.currentlySelectedPersona - The currently selected persona index.
 * @param {function} props.setCurrentlySelectedPersona - The callback function to set the currently selected persona index.
 * @param {Array} props.currentlySelectedPersonaAllergies - The list of allergies for the currently selected persona.
 * @param {function} props.setCurrentlySelectedPersonaAllergies - The callback function to set the list of allergies for the currently selected persona.
 * @param {function} props.setMenuId - The callback function to set the menu ID.
 * @param {function} props.setSessionId - The callback function to set the session ID.
 * @param {function} props.setTableNumber - The callback function to set the table number.
 * @param {Array} props.setExcludeCategories - The list of categories to be excluded.
 * @param {Array} props.excludeCategories - The list of excluded categories.
 * @returns {JSX.Element} The JSX representation of the CustomerMenuPage component.
 */
function CustomerMenuPage(props) {
  // State variables
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState([]);
  const [trigger, setTrigger] = React.useState(0);

  // Extract sessionId, menuId and tableNumber from the URL params
  const params = useParams()
  const sessionId = params.sessionId
  const menuId = params.menuId
  const tableNumber = params.tableNumber

  /**
    * Use Effect hook initialise menuId, sessionId and tableNumber
    */
  React.useEffect(() => {
    props.setMenuId(menuId)
    props.setSessionId(sessionId)
    props.setTableNumber(tableNumber)
  }, []);

  /**
    * Use Effect hook to fetch all menu data when persona changes
    */
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data?.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
        setTrigger((prevTrigger) => prevTrigger + 1);
      }
    };

    fetchData();
  }, [props.currentlySelectedPersona]);

  /**
    * Use Effect hook to fetch all menus in corresponding category or when trigger is triggered
    */
  React.useEffect(() => {
    const fetchCategoryData = async () => {
      if (currentSelectedCategoryId !== -1) {
        const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}&allergies=[${props.currentlySelectedPersonaAllergies}]&excluded_cat_ids=[${props.excludeCategories}]`;
        const data = await makeRequest(url, 'GET', undefined, undefined);
        setMenuItems(data);
        fetchAllMenuData();
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId, trigger]);

  /**
   * Fetches all menu data based on the currently selected persona and excluded categories.
   * @returns {Array} The list of categories with their menu items.
   */
  async function fetchAllMenuData() {
    const url = `/customer/view_menu?session_id=${sessionId}&menu_id=${menuId}&allergies=[${props.currentlySelectedPersonaAllergies}]&excluded_cat_ids=[${props.excludeCategories}]`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setCategories(data);
    return data;
  }

  /**
   * Handles the change of persona selection.
   * @param {Object} event - The event object containing the selected value.
   */
  const handlePersonaChange = (event) => {
    const selectedIndex = event.target.value;
    const selectedPersona = props.personas[selectedIndex];
    const selectedPersonaAllergies = selectedPersona[1] || [];
    const selectedPersonaExcludedCatList = selectedPersona[2] || [];

    props.setCurrentlySelectedPersona(selectedIndex);
    props.setCurrentlySelectedPersonaAllergies(selectedPersonaAllergies);
    props.setExcludeCategories(selectedPersonaExcludedCatList);
  };

  /**
   * Fetches the menu items for the currently selected category.
   * @returns {Array} The list of menu items for the selected category.
   */
  async function fetchCategoryMenuItems() {
    const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setMenuItems(data);
    return data;
  }

  if (!categories || !Array.isArray(categories)) return <>loading...</>;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '25%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {categories.map((category, index) => (
          <CategoryCustomer
            categoryName={category[Object.keys(category)[0]][0].toString()}
            key={index} // Using index as the key since it is guaranteed to be unique
            id={Object.keys(category)[0]}
            setCurrentSelectedCategory={setCurrentSelectedCategory}
            currentSelectedCategoryId={currentSelectedCategoryId}
            fetchAllMenuData={fetchAllMenuData}
            setCurrentSelectedCategoryId={setCurrentSelectedCategoryId}
            setMenuItems={setMenuItems}
            fetchCategoryMenuItems={fetchCategoryMenuItems}
          />
        ))}
        </div>
        <div style={{ width: '75%', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ width: '85%' }}>
              <Typography className='h4' variant="overline" style={{fontSize: '2rem', margin: '10px'}} gutterBottom><b>{currentSelectedCategory}</b></Typography>
            </div>
            <div>
              <FormControl variant="outlined" style={{width: '15vh', margin: '10px'}}>
                <InputLabel>Choose Persona</InputLabel>
                <Select
                  value={props.currentlySelectedPersona}
                  onChange={handlePersonaChange}
                  label="Choose Persona"
                >
                  {props.personas.map((persona, index) => (
                    <MenuItem key={index} value={index}>
                      {persona[0]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {menuItems && menuItems.length > 0 && menuItems.map((menuItem, index) => (
            <CustomerFoodItem
              key={index}
              originalFoodName={menuItem.food_name}
              originalFoodDescription={menuItem.food_description}
              originalPrice={menuItem.food_price.toString()}
              originalImage={menuItem.food_image}
              originalIngredients={menuItem.food_ingredients}
              foodId={menuItem.food_id.toString()}
              foodCategoryId={menuItem.food_category_id}
              fetchAllMenuData={fetchAllMenuData}
              fetchCategoryMenuItems={fetchCategoryMenuItems}
              currentlySelectedPersona={props.currentlySelectedPersona}
              currentSelectedCategoryId={currentSelectedCategoryId}
              personas={props.personas}
              setExcludeCategories={props.setExcludeCategories}
              excludeCategories={props.excludeCategories}
              handleExcludeCategories={props.handleExcludeCategories}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CustomerMenuPage;

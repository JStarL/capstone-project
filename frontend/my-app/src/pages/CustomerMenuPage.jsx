import React from 'react';
import '../App.css';
import CustomerFoodItem from '../components/CustomerFoodItem';
import CategoryCustomer from '../components/CategoryCustomer';
import makeRequest from '../makeRequest';
import { Typography, Select, MenuItem, FormControl, InputLabel, useThemeProps } from '@mui/material';
import { useParams } from 'react-router-dom';

function CustomerMenuPage({ personas, currentlySelectedPersona, setCurrentlySelectedPersona, currentlySelectedPersonaAllergies, setCurrentlySelectedPersonaAllergies, setMenuId, setSessionId, setTableNumber }) {
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState([]);
  // const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState(0);
  // const [currentlySelectedPersonaAllergies, setCurrentlySelectedPersonaAllergies] = React.useState([]);
  const [trigger, setTrigger] = React.useState(0);

  const params = useParams()
  const sessionId = params.sessionId
  const menuId = params.menuId
  const tableNumber = params.tableNumber

  React.useEffect(() => {
    setMenuId(menuId)
    setSessionId(sessionId)
    setTableNumber(tableNumber)
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data?.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
        setTrigger((prevTrigger) => prevTrigger + 1);
      }
    };

    fetchData();
  }, [currentlySelectedPersona]);

  React.useEffect(() => {
    const fetchCategoryData = async () => {
      if (currentSelectedCategoryId !== -1) {
        const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}&allergies=[${currentlySelectedPersonaAllergies}]`;
        const data = await makeRequest(url, 'GET', undefined, undefined);
        setMenuItems(data);
        fetchAllMenuData();
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId, trigger]);

  async function fetchAllMenuData() {
    const url = `/customer/view_menu?session_id=${sessionId}&menu_id=${menuId}&allergies=[${currentlySelectedPersonaAllergies}]`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setCategories(data);
    return data;
  }

  const handlePersonaChange = (event) => {
    const selectedIndex = event.target.value;
    const selectedPersona = personas[selectedIndex];
    const selectedPersonaAllergies = selectedPersona[1] || [];
  
    setCurrentlySelectedPersona(selectedIndex); // Use the index as the selected value
    setCurrentlySelectedPersonaAllergies(selectedPersonaAllergies);
  };


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
          {categories.map((category) => (
            <CategoryCustomer
              categoryName={category[Object.keys(category)[0]][0].toString()}
              key={Object.keys(category)[0]} // category id
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
              <Typography className='h4' variant="h4" gutterBottom>Customer Menu Page - {currentSelectedCategory}</Typography>
            </div>
            <div>
              <FormControl variant="outlined" style={{width: '15vh', margin: '10px'}}>
                <InputLabel>Choose Persona</InputLabel>
                <Select
                  value={currentlySelectedPersona}
                  onChange={handlePersonaChange}
                  label="Choose Persona"
                >
                  {personas.map((persona, index) => (
                    <MenuItem key={index} value={index}>
                      {persona[0]}
                    </MenuItem>
                  ))}
                </Select>


              </FormControl>
            </div>
          </div>

          {menuItems?.map((menuItem) => (
            <CustomerFoodItem
              originalFoodName={menuItem.food_name}
              originalFoodDescription={menuItem.food_description}
              originalPrice={menuItem.food_price.toString()}
              originalImage={menuItem.food_image}
              originalIngredients={menuItem.food_ingredients}
              foodId={menuItem.food_id.toString()}
              categoryId={currentSelectedCategoryId}
              fetchAllMenuData={fetchAllMenuData}
              fetchCategoryMenuItems={fetchCategoryMenuItems}
              currentlySelectedPersona={currentlySelectedPersona}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CustomerMenuPage;

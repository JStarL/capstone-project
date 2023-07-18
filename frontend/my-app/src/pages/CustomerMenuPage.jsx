import React from 'react';
import '../App.css';
import CustomerFoodItem from '../components/CustomerFoodItem';
import { useNavigate } from 'react-router-dom';
import CategoryCustomer from '../components/CategoryCustomer';
import makeRequest from '../makeRequest';
import { Typography } from '@mui/material';
import { StyledButton } from './CustomerOrStaff';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';

function CustomerMenuPage({ personas }) {
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState([]); // List of Menu items for the current selected category
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState('')
  const [currentlySelectedPersonaAllergies, setCurrentlySelectedPersonaAllergies] = React.useState([])
  const [trigger, setTrigger] = React.useState(0)

  console.log(personas)

  const sessionId = localStorage.getItem('session_id');
  const menuId = localStorage.getItem('menu_id') // hard code for now but update this when we implement search restaurant
  // localStorage.getItem('menu_id');

  // React.useEffect(() => {
  //   console.log('About to get data')
  //   const fetchData = async () => {
  //     const data = await fetchAllMenuData();
  //     console.log('The data is: ' + data)
  //     if (data && data?.length > 0) {
  //       setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
  //       console.log(data)
  //       console.log('ID: ' + currentSelectedCategoryId)
  //     }
  //     console.log('outside if')
  //   };

  //   fetchData();
  // }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data?.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
        setTrigger((prevTrigger) => prevTrigger + 1)
        console.log(data)
      }
    };

    fetchData();
  }, [currentlySelectedPersona]);

  React.useEffect(() => {
    const fetchCategoryData = async () => {
      if (currentSelectedCategoryId !== -1) {
        const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}&allergies=[${currentlySelectedPersonaAllergies}]`;
        const data = await makeRequest(url, 'GET', undefined, undefined)
        setMenuItems(data)
        fetchAllMenuData()
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId, trigger])

  async function fetchAllMenuData() {
    const url = `/customer/view_menu?session_id=${sessionId}&menu_id=${menuId}&allergies=[${currentlySelectedPersonaAllergies}]`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    console.log(data)
    setCategories(data);
    return data;
  }

  const handlePersonaChange = (persona) => {
    console.log(persona)
    // console.log(personaAllergyArray)
    const personaAllergyString = persona.slice(1).join(',')
    console.log(personaAllergyString)
    // console.log(personaAllergyString)
    setCurrentlySelectedPersona(persona)
    setCurrentlySelectedPersonaAllergies(personaAllergyString)
    // console.log(personaAllergy)
  }

  async function fetchCategoryMenuItems() {
    const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setMenuItems(data)
    return data
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
            >
            </CategoryCustomer>
          ))}
        </div>
        <div style={{ width: '75%', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div style={{ width: '85%' }}>
          <Typography className='h4' variant="h4" gutterBottom>Customer Menu Page - {currentSelectedCategory}</Typography>
          </div>
          <div  style={{ width: '15%' }}>
          <select value={currentlySelectedPersona} onChange={(e) => handlePersonaChange(personas[e.target.selectedIndex])}>
            {personas.map((persona) => (
              <option key={persona} value={persona}>
                {`${persona[0]}`}
              </option>
            ))}
            </select>
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
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CustomerMenuPage;

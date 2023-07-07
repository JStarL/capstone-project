import React from 'react';
import '../App.css';
import CustomerFoodItem from '../components/CustomerFoodItem';
import { useNavigate } from 'react-router-dom';
import CategoryCustomer from '../components/CategoryCustomer';
import makeRequest from '../makeRequest';
import { Typography } from '@mui/material';
import { StyledButton } from './CustomerOrStaff';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';

function CustomerMenuPage() {
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(1);
  const [menuItems, setMenuItems] = React.useState([]); // List of Menu items for the current selected category

  const navigate = useNavigate();

  const sessionId = localStorage.getItem('session_id');
  const menuId = 1 // hard code for now but update this when we implement search restaurant
  // localStorage.getItem('menu_id');

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data?.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
        console.log(data)
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchCategoryData = async () => {
      if (currentSelectedCategoryId !== 1) {
        // await fetchCategoryMenuItems();
        // setMenuItems(data)
        // console.log(data)
        const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}`;
        const data = await makeRequest(url, 'GET', undefined, undefined)
        setMenuItems(data)
        fetchAllMenuData()
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId])

  async function fetchAllMenuData() {
    const url = `/customer/view_menu?session_id=${sessionId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setCategories(data);

    // for (const [key, value] of Object.entries(data)) {
    //   for (const [key1, value1] of Object.entries(value)) {
    //     if (value1[1]?.length > 0) {
    //       setMenuItems(value1[1])
    //     }
    //     console.log(value1[1]);
    //   }

    // }
    return data; // Return the fetched data
  }

  async function fetchCategoryMenuItems() {
    const url = `/customer/view_category?session_id=${sessionId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setMenuItems(data)
    return data
  }

  React.useEffect(() => {
  }, [menuItems]);

  if (!categories || !Array.isArray(categories)) return <>loading...</>;

  return <>
    <Typography className='h4' variant="h4" gutterBottom>Customer Menu Page - {currentSelectedCategory} with ID: {currentSelectedCategoryId}</Typography>

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
            {console.log()}
          </CategoryCustomer>

        ))}
      </div>
      <div style={{ width: '75%', height: '100%' }}>
        {menuItems.map((menuItem) => (
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
}

export default CustomerMenuPage;

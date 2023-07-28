import React from 'react';
import '../App.css';
import { Typography } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import BestSellingFoodItem from '../components/BestSellingFoodItem';
import makeRequest from '../makeRequest';
import PropTypes from 'prop-types';
import NewCategoryField from '../components/NewCategoryField';
import { StyledButton } from './CustomerOrStaff';

function ManagerMenuPage() {
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState([]); // List of Menu items for the current selected category
  const [allergies, setAllergies] = React.useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const managerId = params.managerId;
  const menuId = params.menuId;

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data?.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchCategoryData = async () => {
      if (currentSelectedCategoryId !== -1) {
        const url = `/manager/view_category?manager_id=${managerId}&category_id=${currentSelectedCategoryId}`;
        const data = await makeRequest(url, 'GET', undefined, undefined)
        setMenuItems(data);
        console.log(data);
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId])

  async function fetchAllMenuData() {
    const url = `/manager/view_menu?manager_id=${managerId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setCategories(data);
    return data; // Return the fetched data
  }

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchAllergies();
    };
    fetchData();
  }, []);

  async function fetchAllergies() {
    const url = '/get_allergies';
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setAllergies([...allergies, ...data]);
    return data;
  }

  async function fetchCategoryMenuItems() {
    const url = `/manager/view_category?manager_id=${managerId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setMenuItems(data);
    console.log(data);
    return data
  }

  function getOtherCategoryOrderingId(swapDirection, categoryId) {
    let categoriesIndex = -1;
    categoryId = Number(categoryId);
    categories.every((obj, index) => {
      for (const [key] of Object.entries(obj)) {
        let k = Number(key);
        if (k === categoryId) {
          categoriesIndex = index;
          return false;
        }
      }
      return true;
    })

    if (swapDirection === 'up') {
      categoriesIndex = categoriesIndex - 1;
      if (categoriesIndex === 0) {
        alert('Error: Cannot swap with Best Selling category');
        return;
      }
    } else if (swapDirection === 'down') {
      categoriesIndex = categoriesIndex + 1;
      if (categoriesIndex >= categories.length) {
        alert('Error: This is the last category, cannot move category further down');
        return;
      }
    } else {
      alert('Invalid swap direction')
      return;
    }


    for (const [key] of Object.entries(categories[categoriesIndex])) {
      return Number(categories[categoriesIndex][key][2])
    }
  }
  
  function getOtherMenuItemOrderingId(swapDirection, menuItemId) {
  	let menuItemIndex = -1;
    menuItemId = Number(menuItemId);
    menuItems.every((obj, index) => {
      let foodId = Number(obj['food_id'])
      console.log('foodId is: ' + foodId);
      if (foodId === menuItemId) {
        menuItemIndex = index;
        return false;
      }
      
      return true;
    })

    if (swapDirection === 'up') {
      menuItemIndex = menuItemIndex - 1;
      if (menuItemIndex < 0) {
      	alert('Error: This is the first menu item, cannot move it further up');
      	return;
      }
    } else if (swapDirection === 'down') {
      menuItemIndex = menuItemIndex + 1;
      if (menuItemIndex >= menuItems.length) {
        alert('Error: This is the last menu item, cannot move it further down');
        return;
      }
    } else {
      alert('Invalid swap direction');
      return;
    }


    return Number(menuItems[menuItemIndex]['food_ordering_id']);
   
  }

  if (!categories || !Array.isArray(categories)) return <>loading...</>;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '25%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {categories?.map((category, index) => (
            <CategoryManager
              categoryName={category[Object.keys(category)[0]][0]}
              key={index} // category id 
              id={Object.keys(category)[0]}
              setCurrentSelectedCategory={setCurrentSelectedCategory}
              fetchAllMenuData={fetchAllMenuData}
              setCurrentSelectedCategoryId={setCurrentSelectedCategoryId}
              currentSelectedCategoryId={currentSelectedCategoryId}
              setMenuItems={setMenuItems}
              fetchCategoryMenuItems={fetchCategoryMenuItems}
              orderingId={category[Object.keys(category)[0]][2]}
              getOtherCategoryOrderingId={getOtherCategoryOrderingId}
              index={index}
              categoriesSize={categories.length}
            >
            </CategoryManager>
          ))}
          <NewCategoryField
            menuId={menuId}
            managerId={managerId}
            fetchAllMenuData={fetchAllMenuData}
          />
        </div>
        <div style={{ width: '75%', height: '100%' }}>
          <Typography className='h4' variant="h4" gutterBottom>Manager Menu Page - {currentSelectedCategory}</Typography>
          <div>
            {menuItems && menuItems.length > 0 && menuItems.map((menuItem, index) => (
              currentSelectedCategory === 'Best Selling' ? (
                <BestSellingFoodItem
                  key={menuItem.food_id}
                  originalFoodName={menuItem.food_name}
                  originalFoodDescription={menuItem.food_description}
                  originalPrice={menuItem.food_price.toString()}
                  originalImage={menuItem.food_image}
                />
              ) : (
                <ManagerFoodItem
                  originalFoodName={menuItem.food_name}
                  originalFoodDescription={menuItem.food_description}
                  originalPrice={menuItem.food_price.toString()}
                  originalImage={menuItem.food_image}
                  originalIngredients={menuItem.food_ingredients}
                  foodId={menuItem.food_id.toString()}
                  categoryId={currentSelectedCategoryId}
                  categoryName={currentSelectedCategory}
                  fetchAllMenuData={fetchAllMenuData}
                  fetchCategoryMenuItems={fetchCategoryMenuItems}
                  allergies={allergies}
                  getOtherMenuItemOrderingId={getOtherMenuItemOrderingId}
                  orderingId={menuItem.food_ordering_id}
                  index={index}
                  menuItemsSize={menuItems.length}
                >
                </ManagerFoodItem>
              )
            ))}
          </div>
          <div>
            <br></br>
            {currentSelectedCategory !== 'Best Selling'
              ? <StyledButton variant='outlined' sx={{ width: '25%' }} onClick={() => { navigate(`/manager/addnewmenuitem/${menuId}/${managerId}/${currentSelectedCategory}/${currentSelectedCategoryId}`) }}>Add new menu item</StyledButton>
              : null
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerMenuPage;

ManagerMenuPage.propTypes = {
  id: PropTypes.string,
};

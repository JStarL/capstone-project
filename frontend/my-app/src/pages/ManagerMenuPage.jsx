import React from 'react';
import '../App.css';
import { Button, TextField, Typography } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import BestSellingFoodItem from '../components/BestSellingFoodItem';
import AddIcon from '@mui/icons-material/Add';
import makeRequest from '../makeRequest';
import PropTypes from 'prop-types';
import NewCategoryField from '../components/NewCategoryField';
import { StyledButton } from './CustomerOrStaff';

function ManagerMenuPage() {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState([]); // List of Menu items for the current selected category
  const navigate = useNavigate();
  const params = useParams();

  const managerId = localStorage.getItem('staff_id');
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
        setMenuItems(data)
        console.log(currentSelectedCategoryId)
        console.log('here')
        // fetchAllMenuData()
      }
    };
    fetchCategoryData();
  }, [currentSelectedCategoryId])

  async function fetchAllMenuData() {
    const url = `/manager/view_menu?manager_id=${managerId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setCategories(data);
    // for (let key in data[0]) {
    //   setMenuItems(data[0][key][1])
    // }
    return data; // Return the fetched data
  }

  function addNewCategory() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_id': menuId,
      'category_name': newCategoryName
    });

    if (newCategoryName !== '') {
      makeRequest('/manager/add_category', 'POST', body, undefined)
        .then(data => {
          setNewCategoryName('')
          fetchAllMenuData(); // basically updates/refreshes the page
        })
        .catch(e => console.log('Error: ' + e));
    } else {
      alert('Invalid category name')
    }
  }

  async function fetchCategoryMenuItems() {
    const url = `/manager/view_category?manager_id=${managerId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setMenuItems(data)
    return data
  }

  if (!categories || !Array.isArray(categories)) return <>loading...</>;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div style={{ width: '20%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {categories?.map((category) => (
            <CategoryManager
              categoryName={category[Object.keys(category)[0]][0]}
              key={Object.keys(category)[0]} // category id 
              id={Object.keys(category)[0]}
              setCurrentSelectedCategory={setCurrentSelectedCategory}
              fetchAllMenuData={fetchAllMenuData}
              setCurrentSelectedCategoryId={setCurrentSelectedCategoryId}
              currentSelectedCategoryId={currentSelectedCategoryId}
              setMenuItems={setMenuItems}
              fetchCategoryMenuItems={fetchCategoryMenuItems}
            />
          ))}
          <NewCategoryField
            // newCategoryName={newCategoryName}
            // setNewCategoryName={setNewCategoryName}
            // addNewCategory={addNewCategory}
            menuId={menuId}
            managerId={managerId}
            fetchAllMenuData={fetchAllMenuData}
          />
          {/* <TextField
            label='New Category Name'
            onChange={e => setNewCategoryName(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
            value={newCategoryName || ''}
          />
          <Button onClick={addNewCategory} startIcon={<AddIcon />}>Add new category</Button> */}
        </div>
        <div style={{ width: '80%', height: '100%' }}>
        <Typography className='h4' variant="h4" gutterBottom>Manager Menu Page - {currentSelectedCategory}</Typography>
          <div>
          {menuItems?.map((menuItem) =>
            currentSelectedCategory === 'Best Selling' ? (
              <BestSellingFoodItem
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
              />
            )
          )}
          </div>
          <div>
            <br></br>
            {currentSelectedCategory !== 'Best Selling'
              ? <StyledButton sx={{width: '25%'}} onClick={() => { navigate(`/manager/addnewmenuitem/${menuId}/${currentSelectedCategory}/${currentSelectedCategoryId}`) }}>Add new menu item</StyledButton>
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

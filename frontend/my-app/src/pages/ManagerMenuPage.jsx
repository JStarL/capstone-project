import React from 'react';
import '../App.css';
import { Button, TextField, Typography } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem';
import { useNavigate } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import AddIcon from '@mui/icons-material/Add';
import makeRequest from '../makeRequest';
import PropTypes from 'prop-types';

function ManagerMenuPage() {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [currentSelectedCategory, setCurrentSelectedCategory] = React.useState('Best Selling');
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = React.useState(1);
  const [menuItems, setMenuItems] = React.useState([]); // List of Menu items for the current selected category
  const navigate = useNavigate();

  const managerId = localStorage.getItem('staff_id');
  const menuId = localStorage.getItem('menu_id');

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMenuData();
      if (data && data.length > 0) {
        setCurrentSelectedCategoryId(Object.keys(data[0])[0]);
      }
    };

    fetchData();
  }, []);

  async function fetchAllMenuData() {
    const url = `/manager/view_menu?manager_id=${managerId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    console.log(data)
    setCategories(data);
    return data; // Return the fetched data
  }

  function addNewCategory() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_id': menuId,
      'category_name': newCategoryName
    });

    makeRequest('/manager/add_category', 'POST', body, undefined)
      .then(data => {
        setNewCategoryName('')
        fetchAllMenuData(); // basically updates/refreshes the page
      })
      .catch(e => console.log('Error: ' + e));
  }

  async function fetchCategoryMenuItems() {
    const url = `/manager/view_category?manager_id=${managerId}&category_id=${currentSelectedCategoryId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setMenuItems(data)
    console.log(menuItems)
    console.log(data)
  }

  if (!categories || !Array.isArray(categories)) return <>loading...</>;
  return (
    <>
      <Typography className='h4' variant="h4" gutterBottom>Manager Menu Page - {currentSelectedCategory} with ID: {currentSelectedCategoryId}</Typography>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {categories.map((category) => (
            <CategoryManager
              categoryName={category[Object.keys(category)[0]][0]}
              key={Object.keys(category)[0]} // category id 
              id={Object.keys(category)[0]}
              setCurrentSelectedCategory={setCurrentSelectedCategory}
              fetchAllMenuData={fetchAllMenuData}
              setCurrentSelectedCategoryId={setCurrentSelectedCategoryId}
              setMenuItems={setMenuItems}
            />
          ))}
          <TextField
            label='New Category Name'
            onChange={e => setNewCategoryName(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
            value={newCategoryName || ''}
          />
          <Button onClick={addNewCategory} startIcon={<AddIcon />}>Add new category</Button>
        </div>
        <div style={{ width: '80%', height: '100%' }}>
          {menuItems?.map((menuItem) => (
            <ManagerFoodItem
              originalFoodName={menuItem.food_name}
              originalFoodDescription={menuItem.food_description}
              originalPrice={menuItem.food_price.toString()}
              originalImage={menuItem.food_image}
              foodId={menuItem.food_id.toString()}
              categoryId={currentSelectedCategoryId}
              fetchAllMenuData={fetchAllMenuData}
              fetchCategoryMenuItems={fetchCategoryMenuItems}
            />
            ))}
        </div>
      </div>
      <Button onClick={() => { navigate(`/manager/addnewmenuitem/${menuId}/${currentSelectedCategoryId}`) }}>Add new menu item</Button>
    </>
  );
}

export default ManagerMenuPage;

ManagerMenuPage.propTypes = {
  id: PropTypes.string,
};

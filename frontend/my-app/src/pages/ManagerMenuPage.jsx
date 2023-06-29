import React from 'react';
import '../App.css';
import { Button, TextField } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem'
import { useNavigate } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import AddIcon from '@mui/icons-material/Add';
import makeRequest from '../makeRequest';

function ManagerMenuPage() {
  const [foodName, setFoodName] = React.useState('Food Name');
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [foodDescription, setFoodDescription] = React.useState('Food Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo')
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const managerId = localStorage.getItem('staff_id')
  const menuId = localStorage.getItem('menu_id')

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchAllMenuData();
    };

    fetchData();
  }, []);
  // React.useEffect(async () => {
  //   const managerId = localStorage.getItem('staff_id')
  //   const menuId = localStorage.getItem('menu_id')
  //   async function fetchData () {
  //     makeRequest(`/manager/view_menu/${managerId}/${menuId}`, 'GET', undefined, managerId)
  //     .then(data => {
  //       console.log(data)})
  //   }
  //   fetchData();
  // }, []);

  function addNewCategory() {
    const body = JSON.stringify({
      'manager_id': managerId,
      'menu_id': menuId,
      'category_name': newCategoryName
    })
    makeRequest('/manager/add_category', 'POST', body, undefined)
      .then(data => {
        console.log(data)
      })
      .catch(e => console.log('Error: ' + e))
  }

  async function fetchAllMenuData() {
    const url = `/manager/view_menu?manager_id=${managerId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setCategories(data)
    console.log(categories)
  }
  // if (!cate) return <>loading...</>;

  return <>MANAGER MENU PAGE
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '20%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {categories.map((category) => (
          <CategoryManager key={category}></CategoryManager>
        ))}
        <TextField label='New Category Name'
          onChange={e => setNewCategoryName(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
          value={newCategoryName}
        />
        <Button onClick={addNewCategory} startIcon={<AddIcon />}></Button>
      </div>
      <div style={{ width: '80%', height: '100%' }}>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
        <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      </div>
    </div>

    <Button onClick={() => { navigate('/manager/addnewmenuitem') }}>Add new menu item</Button>
  </>
}

export default ManagerMenuPage;
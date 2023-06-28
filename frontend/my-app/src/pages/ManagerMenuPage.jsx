import React from 'react';
import '../App.css';
import { Button, TextField } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem'
import { useNavigate } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import AddIcon from '@mui/icons-material/Add';

function ManagerMenuPage() {
  const [foodName, setFoodName] = React.useState('Food Name');
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [foodDescription, setFoodDescription] = React.useState('Food Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo')
  const navigate = useNavigate();
  return <>MANAGER MENU PAGE
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '20%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CategoryManager></CategoryManager>
        <CategoryManager></CategoryManager>
        <CategoryManager></CategoryManager>
        <CategoryManager></CategoryManager>
        <TextField label='New Category Name'
          onChange={e => setNewCategoryName(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
          value={newCategoryName} 
        />
        <Button onClick={() => console.log('Add new category')}startIcon={<AddIcon/>}></Button>
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
import React from 'react';
import '../App.css';
import { Button } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem'
import { useNavigate } from 'react-router-dom';
import Category from '../components/Category';

function ManagerMenuPage () {
  const [foodName, setFoodName] = React.useState('Food Name');
  const [foodDescription, setFoodDescription] = React.useState('Food Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo')
  const navigate = useNavigate();
  return <>MANAGER MENU PAGE
  <div style={{ display: 'flex'}}>
    <div style={{ width: '20%', backgroundColor: 'white', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Category></Category>
      <Category></Category>
      <Category></Category>
      <Category></Category>
    </div>
    <div style={{ width: '80%', height: '100%'}}>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
      <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
    </div>
  </div>
  
  <Button onClick={ () => { navigate('/manager/addnewmenuitem') } }>Add new menu item</Button>
  </>
}

export default ManagerMenuPage;
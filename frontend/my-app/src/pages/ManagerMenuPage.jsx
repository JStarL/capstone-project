import React from 'react';
import '../App.css';
import { Button } from '@mui/material';
import ManagerFoodItem from '../components/ManagerFoodItem'
import { useNavigate } from 'react-router-dom';

function ManagerMenuPage () {
  const [foodName, setFoodName] = React.useState('Food Name');
  const [foodDescription, setFoodDescription] = React.useState('Food Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo')
  const navigate = useNavigate();
  return <>MANAGER MENU PAGE
  <div>
    <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
    <ManagerFoodItem originalFoodName={foodName} originalFoodDescription={foodDescription}></ManagerFoodItem>
  </div>
  <Button onClick={ () => { navigate('/manager/addnewmenuitem') } }>Add new menu item</Button>
  </>
}

export default ManagerMenuPage;
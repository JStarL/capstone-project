import React from 'react';
import '../App.css';
import { Button } from '@mui/material';
import CustomerFoodItem from '../components/CustomerFoodItem';
import { useNavigate } from 'react-router-dom';
import Category from '../components/Category';

function CustomerMenuPage () {
  const [foodName, setFoodName] = React.useState('Food Name');
  const [foodDescription, setFoodDescription] = React.useState('Food Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo')
  const [foodPrice, setFoodPrice] = React.useState(2)

  const navigate = useNavigate();

  return <>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '20%', backgroundColor: 'white', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Category></Category>
        <Category></Category>
        <Category></Category>
        <Category></Category>
      </div>
      <div style={{ width: '80%', height: '100%'}}>
        CATEGORY ONE
        <CustomerFoodItem foodName={foodName} foodDescription={foodDescription} foodPrice={foodPrice}></CustomerFoodItem>
        <CustomerFoodItem foodName={foodName} foodDescription={foodDescription} foodPrice={foodPrice}></CustomerFoodItem>
        <CustomerFoodItem foodName={foodName} foodDescription={foodDescription} foodPrice={foodPrice}></CustomerFoodItem>
      </div>
    </div>
  </>
}

export default CustomerMenuPage;

import React from 'react';
import './Components.css';
import { Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';

function CustomerFoodItem (props) {
  const navigate = useNavigate();

  return <>
  <div className='food-item-div'>
    <div>
      {props.originalImage
      ? <div className='image'><img style={{ height: '200px', width: '200px', margin: '5px' }} src={props.originalImage}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><b>{props.originalFoodName}</b></div>
      <div className='div-section'>{props.originalFoodDescription}</div>
      <div className='div-section'>Price: $ {props.originalPrice}</div>
    </div>
    <div className='food-item-button'>
        <StyledButton style={{ margin: '5px' }} onClick={() => navigate(`/customer/1/${props.foodId}`)}>Find out more</StyledButton>
        <StyledButton style={{ margin: '5px' }}>Add to Order</StyledButton>
    </div>
  </div>
  </>
}

export default CustomerFoodItem;
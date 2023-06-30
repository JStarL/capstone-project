import React from 'react';
import './Components.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
        <Button onClick={() => navigate(`/customer/1/${props.foodId}`)}>Find out more</Button>
        <Button>Add to Order</Button>
    </div>
  </div>
  </>
}

export default CustomerFoodItem;
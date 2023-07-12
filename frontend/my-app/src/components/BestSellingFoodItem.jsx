import React from 'react';
import './Components.css';
import { Button } from '@mui/material';

function BestSellingFoodItem (props) {
  return <>
  <div key={props.foodId} className='food-item-div'>
    <div>
      {props.originalImage
      ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={props.originalImage}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><b>{props.originalFoodName}</b></div>
      <div className='div-section'>{props.originalFoodDescription}</div>
      <div className='div-section'>Price: $ {props.originalPrice}</div>
    </div>
  </div>
  </>
}

export default BestSellingFoodItem;
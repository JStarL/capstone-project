import React from 'react';
import './Components.css';
import { Button } from '@mui/material';

function BestSellingFoodItem (props) {
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
  </div>
  </>
}

export default BestSellingFoodItem;
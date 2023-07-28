import React from 'react';
import './Components.css';

function BestSellingFoodItem (props) {
  return <>
  <div className='food-item-div'>
    <div>
      {props.originalImage
      ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={props.originalImage}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><b>{props.originalFoodName}</b></div>
      <div className='div-section'><i>{props.originalFoodDescription}</i></div>
      <div className='div-section'><b>Price:</b> ${props.originalPrice}</div>
    </div>
  </div>
  </>
}

export default BestSellingFoodItem;
import React from 'react';
import './Components.css';
import { Button, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function CustomerFoodItem (props) {
  const navigate = useNavigate();
  const params = useParams();
  
  return <>
  <div className='food-item-div' style={{ width: '100%' }}>
    <div>
      {props.originalImage
      ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={props.originalImage}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle'>
      <div className='div-section'><b>Food Name</b></div>
      <div className='div-section'>Food Description</div>
      <div className='div-section'>Price: $</div>
    </div>
  </div>
  </>
}

export default CustomerFoodItem;
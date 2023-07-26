import React from 'react';
import './Components.css';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function KitchenStaffOrder(props) {
  const [cooking, setCooking] = React.useState(false)

  const completeOrder = () => {
    console.log('order completed')
    props.setTrigger(!props.trigger)
  }
  return (
    <>
    <div className='kitchen-staff-order'>
      <div style={{ width: '10%' }} className='kitchen-staff-time-div'>TIMESTAMP</div>
      <div style={{ width: '90%' }} className='kitchen-staff-order-div'>
        <div style={{ marginTop: '15px' }}><b>Table Number: {props.tableId}</b></div>
    {props.menuItems?.map((menuItem) => (
      <>
      <div className='kitchen-staff-menu-item'>
      <div>
        {menuItem.image ? (
          <div className='image'>
            <img
              style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
              src={menuItem.image}
            ></img>
          </div>
        ) : (
          <div className='food-item-img'>IMG</div>
        )}
      </div>
      <div className='food-item-middle'>
        <div className='div-section'>
          <b>{menuItem.food_name}</b>
        </div>
        <div className='div-section'>Amount: {menuItem.amount}</div>
      </div>
      {/* <div className='food-item-button'>
        <StyledButton onClick={() => setCooking(!cooking)}>{cooking ? 'Cooking' : 'Pending...'}</StyledButton>
      </div> */}
    </div>
    </>
    ))}
    <StyledButton onClick={completeOrder} style={{ width: '90%', marginBottom: '5px' }}>Complete Order</StyledButton>
    </div>
    </div>
    </>
  );
}

export default KitchenStaffOrder;

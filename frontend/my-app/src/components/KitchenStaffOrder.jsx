import React from 'react';
import './Components.css';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function KitchenStaffOrder(props) {
  const [cooking, setCooking] = React.useState(false);

  const completeOrder = () => {
    console.log('order completed');
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId
    });
    makeRequest('/kitchen_staff/mark_order_complete', 'POST', body, undefined)
      .then(data => {
        console.log(data);
        props.setTrigger(!props.trigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  return (
    <>
      <div className='kitchen-staff-order'>
        <div style={{ width: '60%' }} className='kitchen-staff-order-div'>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}><b>Table Number: {props.tableId}</b></div>
            <div>Time since order was placed: TIMESTAMP</div>
          <div className='kitchen-staff-menu-items-container'>
            {props.menuItems?.map((menuItem) => (
              <div key={menuItem.food_name} className='kitchen-staff-menu-item'>
                <div>
                  {menuItem.image ? (
                    <div>
                      <img
                        style={{ justifyContent: 'center', width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
                        src={menuItem.image}
                      ></img>
                    </div>
                  ) : (
                    <div className='food-item-img'>IMG</div>
                  )}
                </div>
                <div style={{
                  width: '20vh',
                  justifyContent: 'flex-start', 
                  textAlign: 'left',
                  marginTop: '12px'
                }}>
                  <div className='div-section'>
                    <b>{menuItem.food_name}</b>
                  </div>
                  <div className='div-section'>Amount: {menuItem.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <StyledButton variant='outlined' onClick={completeOrder} style={{ width: '45vw', marginBottom: '2vh' }}>Complete Order</StyledButton>
        </div>
      </div>
    </>
  );
}

export default KitchenStaffOrder;


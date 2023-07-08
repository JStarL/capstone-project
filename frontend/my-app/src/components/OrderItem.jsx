import React from 'react';
import './Components.css';
import { Button, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function OrderItem (props) {
  const [order, setOrder] = React.useState('')
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params.sessionId;

  React.useEffect(() => {
    async function fetchMenuDetails() {
      const url = `/customer/view_menu_item?session_id=${sessionId}&menu_item_id=${props.menu_item_id}`;
      const data = await makeRequest(url, 'GET', undefined, undefined)
      console.log(data)
      setOrder(data)
      // return data;
    }
    fetchMenuDetails();
    }, [])
  
  return <>
  <div className='food-item-div' style={{ width: '70%' }}>
    <div>
      {order.food_image
      ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={order.food_image}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle' style={{ padding: '10px' }}>
      <div className='div-section'><b>{order.food_name}</b></div>
      <div className='div-section'>{order.food_description}</div>
      <div className='div-section'>Price: ${order.food_price}</div>
    </div>
    <div className='food-item-end'>
      <div className='div-section'>Amount: {props.amount}</div>
    </div>
  </div>
  </>
}

export default OrderItem;
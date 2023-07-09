import React from 'react';
import './Components.css';
import { Button, styled, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function OrderItem (props) {
  const [order, setOrder] = React.useState('')
  const [amount, setAmount] = React.useState(props.amount)
  const [prevAmount, setPrevAmount] = React.useState(props.amount)
  const navigate = useNavigate();
  const params = useParams();
  const menuId = params.menuId;
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

  React.useEffect(() => {
    if (amount < prevAmount) {
      removeFromOrder(1);
    }
    else if (amount > prevAmount) {
      addToOrder();
    }
    setPrevAmount(amount)
  }, [amount])

  function addToOrder() {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': order.food_id,
      'amount': 1,
      'title': order.food_name
    })
    makeRequest('/customer/add_menu_item', 'POST', body, undefined)
      .then(data => {
        console.log(data)
      })
      .catch(e => console.log('Error: ' + e))
  }

  function removeFromOrder(amount) {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': order.food_id,
      'amount': amount,
    })
    makeRequest('/customer/remove_menu_item', 'DELETE', body, undefined)
      .then(data => {
        console.log(data)
      })
      .catch(e => console.log('Error: ' + e))
  }
  
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
    <div className='food-item-end' style={{ flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
      {/* <div> */}
        <StyledButton style={{ width: '50%', marginTop: '25%', marginRight: '10px' }}><DeleteIcon /></StyledButton>
      {/* </div> */}
        <TextField
        label="Amount"
        type="number"
        inputProps={{ min: 0 }}
        sx={{m:2, width: '90%'}}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {/* <div className='div-section'>Amount: {props.amount}</div> */}
    </div>
  </div>
  </>
}

export default OrderItem;
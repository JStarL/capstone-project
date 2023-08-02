import React from 'react';
import './Components.css';
import { TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function OrderItem (props) {
  const [amount, setAmount] = React.useState(props.amount)
  const [prevAmount, setPrevAmount] = React.useState(props.amount)
  const [description, setDescription] = React.useState(props.foodDescription)
  const [name, setName] = React.useState(props.foodName)
  const [image, setImage] = React.useState(props.foodImage)
  const [price, setPrice] = React.useState(props.foodPrice)
  const [menuItemId, setMenuItemId] = React.useState(props.menu_item_id)
  const [orderedByPersona, setOrderedByPersona] = React.useState(props.orderedByPersona)
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState(props.currentlySelectedPersona)
  const params = useParams();
  const menuId = params.menuId;
  const sessionId = params.sessionId;

  React.useEffect(() => {
    setAmount(props.amount)
    setPrevAmount(props.amount)
    setDescription(props.foodDescription)
    setName(props.foodName)
    setImage(props.foodImage)
    setPrice(props.foodPrice)
    setMenuItemId(props.menu_item_id)
    setOrderedByPersona(props.orderedByPersona)
    setCurrentlySelectedPersona(props.currentlySelectedPersona)
  }, [props.amount, props.foodDescription, props.foodName, props.foodImage, props.foodPrice, props.menu_item_id, props.orderedByPersona, props.currentlySelectedPersona]);

  const handleAmountChange = (e) => {
    
    const newAmount = e.target.value;
    setAmount(newAmount);
    const diff = Math.abs(newAmount - prevAmount);

    if (newAmount > prevAmount) {
      addToOrder(diff)
    } else if (newAmount < prevAmount) {
      if (!(newAmount.trim() === '')) {
        removeFromOrder(diff)
      }
      else {
        return;
      }
    }
    
    if (currentlySelectedPersona !== orderedByPersona) {
      setAmount(prevAmount)
    } else {
      setPrevAmount(newAmount);
    } 
    return 
  };

  function addToOrder(amountNum) {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': menuItemId,
      'amount': amountNum,
      'title': name,
      'persona_name': orderedByPersona
    })
    makeRequest('/customer/add_menu_item', 'POST', body, undefined)
      .then(data => {
        props.fetchOrder()
      })
      .catch(e => console.log('Error: ' + e))
  }

  function removeFromOrder(amountNum) {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': menuItemId,
      'amount': amountNum,
      'persona': orderedByPersona
    })
    makeRequest('/customer/remove_menu_item', 'DELETE', body, undefined)
      .then(data => {
        if (amountNum === amount || amount === 0) {
          props.handleExcludeCategories(props.personas[props.currentlySelectedPersona][0], props.foodCategoryId, false);
        }
        props.fetchOrder();
      })
      .catch(e => console.log('Error: ' + e))
  }
  
  return <>
  <div className='food-item-div' style={{ width: '70%' }}>
    <div>
      {image
      ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={image}></img></div>
      : <div className='food-item-img'>IMG</div>}
    </div>
    <div className='food-item-middle' style={{ padding: '10px' }}>
      <div className='div-section'><b>{name}</b></div>
      <div className='div-section'><i>{description}</i></div>
      <div className='div-section'><b>Ordered By: </b>{props.personas[orderedByPersona][0]}</div>
      <div className='div-section'><b>Price:</b> ${price}</div>
    </div>
    <div className='food-item-end' style={{ flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
      <StyledButton onClick={() => removeFromOrder(amount)}style={{ width: '50%', marginTop: '25%', marginBottom: '5px', marginRight: '10px' }}><DeleteIcon /></StyledButton>
      <TextField
      label="Amount"
      type="number"
      inputProps={{ min: 0 }}
      sx={{m:2, width: '90%'}}
      value={amount}
      onChange={handleAmountChange}
    />
    </div>
  </div>
  </>
}

export default OrderItem;
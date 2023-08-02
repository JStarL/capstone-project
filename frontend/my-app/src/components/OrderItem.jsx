import React from 'react';
import './Components.css';
import { TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

/**
 * Represents a single item in the customer's order.
 * @param {Object} props - The props passed to the component.
 * @param {number} props.amount - The amount of the item in the order.
 * @param {string} props.foodDescription - The description of the food item.
 * @param {string} props.foodName - The name of the food item.
 * @param {string} props.foodImage - The image URL of the food item.
 * @param {number} props.foodPrice - The price of the food item.
 * @param {number} props.menu_item_id - The ID of the food item in the menu.
 * @param {string} props.orderedByPersona - The persona name of the customer who ordered the item.
 * @param {string} props.currentlySelectedPersona - The persona currently selected by the user.
 * @returns {JSX.Element} The JSX representation of the OrderItem component.
 */
function OrderItem(props) {
  // Component state
  const [amount, setAmount] = React.useState(props.amount);
  const [prevAmount, setPrevAmount] = React.useState(props.amount);
  const [description, setDescription] = React.useState(props.foodDescription);
  const [name, setName] = React.useState(props.foodName);
  const [image, setImage] = React.useState(props.foodImage);
  const [price, setPrice] = React.useState(props.foodPrice);
  const [menuItemId, setMenuItemId] = React.useState(props.menu_item_id);
  const [orderedByPersona, setOrderedByPersona] = React.useState(props.orderedByPersona);
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState(props.currentlySelectedPersona);

  // Get menuId and sessionId from URL params
  const params = useParams();
  const menuId = params.menuId;
  const sessionId = params.sessionId;

  // Update component state when props change
  React.useEffect(() => {
    setAmount(props.amount);
    setPrevAmount(props.amount);
    setDescription(props.foodDescription);
    setName(props.foodName);
    setImage(props.foodImage);
    setPrice(props.foodPrice);
    setMenuItemId(props.menu_item_id);
    setOrderedByPersona(props.orderedByPersona);
    setCurrentlySelectedPersona(props.currentlySelectedPersona);
  }, [props.amount, props.foodDescription, props.foodName, props.foodImage, props.foodPrice, props.menu_item_id, props.orderedByPersona, props.currentlySelectedPersona]);

  /**
   * Handles the change in the amount of the item.
   * @param {Object} e - The event object.
   */
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    const diff = Math.abs(newAmount - prevAmount);

    if (newAmount > prevAmount) {
      addToOrder(diff);
    } else if (newAmount < prevAmount) {
      if (!(newAmount.trim() === '')) {
        removeFromOrder(diff);
      } else {
        return;
      }
    }

    if (currentlySelectedPersona !== orderedByPersona) {
      setAmount(prevAmount);
    } else {
      setPrevAmount(newAmount);
    }
    return;
  };

  /**
   * Adds the item to the customer's order.
   * @param {number} amountNum - The amount of the item to add.
   */
  function addToOrder(amountNum) {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': menuItemId,
      'amount': amountNum,
      'title': name,
      'persona_name': orderedByPersona
    });

    makeRequest('/customer/add_menu_item', 'POST', body, undefined)
      .then(data => {
        props.fetchOrder();
      })
      .catch(e => console.log('Error: ' + e));
  }

  /**
   * Removes the item from the customer's order.
   * @param {number} amountNum - The amount of the item to remove.
   */
  function removeFromOrder(amountNum) {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId,
      'menu_item_id': menuItemId,
      'amount': amountNum,
      'persona': orderedByPersona
    });

    makeRequest('/customer/remove_menu_item', 'DELETE', body, undefined)
      .then(data => {
        if (amountNum === amount || amount === 0) {
          props.handleExcludeCategories(props.personas[props.currentlySelectedPersona][0], props.foodCategoryId, false);
        }
        props.fetchOrder();
      })
      .catch(e => console.log('Error: ' + e));
  }

  return (
    <>
      <div className='food-item-div' style={{ width: '70%' }}>
        <div>
          {image
            ? <div className='image'><img style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }} src={image} alt="Food Item" /></div>
            : <div className='food-item-img'>IMG</div>}
        </div>
        <div className='food-item-middle' style={{ padding: '10px' }}>
          <div className='div-section'><b>{name}</b></div>
          <div className='div-section'><i>{description}</i></div>
          <div className='div-section'><b>Ordered By: </b>{props.personas[orderedByPersona][0]}</div>
          <div className='div-section'><b>Price:</b> ${price}</div>
        </div>
        <div className='food-item-end' style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <StyledButton onClick={() => removeFromOrder(amount)} style={{ width: '50%', marginTop: '25%', marginBottom: '5px', marginRight: '10px' }}>
            <DeleteIcon />
          </StyledButton>
          <TextField
            label="Amount"
            type="number"
            inputProps={{ min: 0 }}
            sx={{ m: 2, width: '90%' }}
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
      </div>
    </>
  );
}

export default OrderItem;

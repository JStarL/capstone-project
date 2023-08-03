import React from 'react';
import './Components.css';
import { Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

/**
 * Represents a Customer Food Item component.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.foodId - The ID of the food item.
 * @param {string} props.originalImage - The URL of the original food image.
 * @param {string} props.originalFoodName - The name of the original food.
 * @param {string} props.originalFoodDescription - The description of the original food.
 * @param {number} props.originalPrice - The price of the original food.
 * @param {Object} props.personas - An object containing personas data.
 * @param {string} props.currentlySelectedPersona - The currently selected persona.
 * @param {string} props.foodCategoryId - The ID of the food category.
 * @param {Function} props.handleExcludeCategories - Function to handle excluding categories.
 * @returns {JSX.Element} The JSX representation of the Customer Food Item component.
 */

function CustomerFoodItem(props) {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params.sessionId;
  const menuId = params.menuId;
  const tableNumber = params.tableNumber;
  const [trigger, setTrigger] = React.useState(true);
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

  /**
   * Adds the food item to the order.
   */
  function addToOrder() {
    const body = JSON.stringify({
      session_id: sessionId,
      menu_id: menuId,
      menu_item_id: props.foodId,
      amount: 1,
      title: props.originalFoodName,
      persona_name: props.currentlySelectedPersona
    });

    makeRequest('/customer/add_menu_item', 'POST', body, undefined)
      .then(data => {
        setSnackbarOpen(true);
        props.handleExcludeCategories(props.personas[props.currentlySelectedPersona][0], props.foodCategoryId, true);
        setTrigger(!trigger);
      })
      .catch(e => console.log('Error: ' + e));
  }

  /**
   * Handles the snackbar close event.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className='food-item-div'>
        <div>
          {props.originalImage ? (
            <div className='image'>
              <img
                style={{ width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
                src={props.originalImage}
              ></img>
            </div>
          ) : (
            <div className='food-item-img'>IMG</div>
          )}
        </div>
        <div className='food-item-middle'>
          <div className='div-section'>
            <b>{props.originalFoodName}</b>
          </div>
          <div className='div-section'><i>{props.originalFoodDescription}</i></div>
          <div className='div-section'><b>Price:</b> ${props.originalPrice}</div>
        </div>
        <div className='food-item-button'>
          <StyledButton
            variant='outlined'
            style={{ margin: '10px' }}
            onClick={() => navigate(`/customer/${sessionId}/${menuId}/${props.currentSelectedCategoryId}/${tableNumber}/${props.foodId}`)}
          >
            Find out more
          </StyledButton>
          <StyledButton variant='outlined' style={{ margin: '10px' }} onClick={addToOrder}>
            Add to Order
          </StyledButton>
        </div>
      </div>
      <Snackbar
        sx={{
          width: '50%',
          '& .MuiSnackbarContent-root': {
            fontSize: '1.2rem',
          },
        }}
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ fontSize: '2rem', width: 'auto' }}>
          {`Successfully added `}
          <Typography variant="inherit" fontWeight="bold" display="inline">
            {props.originalFoodName}
          </Typography>
          {` to order!`}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CustomerFoodItem;

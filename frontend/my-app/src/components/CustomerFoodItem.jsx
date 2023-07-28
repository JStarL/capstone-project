import React from 'react';
import './Components.css';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';

function CustomerFoodItem(props) {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params.sessionId
  const menuId = params.menuId;
  const tableNumber = params.tableNumber
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

  function addToOrder() {
    console.log(props.currentlySelectedPersona)
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
        console.log(data);
        setSnackbarOpen(true);
      })
      .catch(e => console.log('Error: ' + e));
  }

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
            onClick={() => navigate(`/customer/${sessionId}/${menuId}/${props.categoryId}/${tableNumber}/${props.foodId}`)}
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

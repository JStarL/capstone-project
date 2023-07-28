import React from 'react';
import './Components.css';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import BackHandIcon from '@mui/icons-material/BackHand';
import { Typography, Button, Snackbar, Alert } from '@mui/material';

function Footer(props) {
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false); // State variable for Snackbar open/close status

  const requestAssistance = () => {
    const body = JSON.stringify({
      table_id: props.tableNumber,
      session_id: props.sessionId,
      menu_id: props.menuId,
    });
    makeRequest('/customer/request_assistance', 'POST', body, undefined)
      .then(data => {
        console.log(data);
        setSnackbarOpen(true); // Open the Snackbar on successful request
      })
      .catch(e => console.log('Error: ' + e));
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  const Footer = () => {
    if (props.isManager) {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<PersonAddAlt1SharpIcon />}>
            <Link to={`/manager/addstaff/${props.menuId}/${props.id}`} className="toNavy">Add Staff</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/manager/menu/${props.menuId}/${props.id}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
        </div>
      );
    } else if (props.isCustomer) {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<ShoppingCartIcon />}>
            <Link to={`/customer/${props.sessionId}/view_order/${props.menuId}/${props.tableNumber}`} className="toNavy">View Cart</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/customer/${props.sessionId}/${props.menuId}/${props.tableNumber}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
          <StyledButton startIcon={<SettingsIcon />}>
            <Link to={`/customer/${props.sessionId}/${props.menuId}/${props.tableNumber}/personalise`} className="toNavy">Personalise</Link>
          </StyledButton>
          <StyledButton onClick={requestAssistance} startIcon={<BackHandIcon />} className="toNavy" >
            Request Assistance
          </StyledButton>
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
              Request for assistance sent!
            </Alert>
          </Snackbar>
        </div>
      );
    } else {
      return null; // Render nothing if menuId or tableNumber is missing
    }
  };
  return <>
    <Footer />
  </>
}

export default Footer;
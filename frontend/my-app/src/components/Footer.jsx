import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, styled } from '@mui/material';
import makeRequest from '../makeRequest';
import BackHandIcon from '@mui/icons-material/BackHand';
import { Snackbar, Alert } from '@mui/material';

/**
 * Represents a Footer component.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.sessionId - The session ID.
 * @param {string} props.menuId - The menu ID.
 * @param {string} props.id - The ID.
 * @param {boolean} props.isManager - A boolean flag indicating whether the user is a manager.
 * @param {boolean} props.isCustomer - A boolean flag indicating whether the user is a customer.
 * @param {string} props.tableNumber - The table number.
 * @returns {JSX.Element} The JSX representation of the Footer component.
 */
function Footer(props) {
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false); // State variable for Snackbar open/close status
  const navigate = useNavigate()

  const StyledButton = styled(Button)({
    backgroundColor: '#002250',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#002250',
    },
    width: '100%',
    whiteSpace: 'nowrap',
    padding: '20px',
    margin: '5px'
  });

  /**
   * Sends a request for assistance.
   */
  const requestAssistance = () => {
    const body = JSON.stringify({
      table_id: props.tableNumber,
      session_id: props.sessionId,
      menu_id: props.menuId,
    });
    makeRequest('/customer/request_assistance', 'POST', body, undefined)
      .then(data => {
        setSnackbarOpen(true); // Open the Snackbar on successful request
        setTimeout(() => {
          handleSnackbarClose(); // Close the Snackbar after 3 seconds
        }, 3000);
      })
      .catch(e => console.log('Error: ' + e));
  }

  /**
   * Handles the Snackbar close event.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  /**
   * Returns the appropriate footer content based on the user type.
   * @returns {JSX.Element} The JSX representation of the footer content.
   */
  const FooterContent = () => {
    if (props.isManager) {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<PersonAddAlt1SharpIcon />}
            onClick={() => {navigate(`/manager/addstaff/${props.menuId}/${props.id}`)}} className="toNavy">Add Staff
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}
            onClick={() => {navigate(`/manager/menu/${props.menuId}/${props.id}`)}} className="toNavy">Go to Menu
          </StyledButton>
        </div>
      );
    } else if (props.isCustomer) {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<ShoppingCartIcon />}
            onClick={() => {navigate(`/customer/${props.sessionId}/view_order/${props.menuId}/${props.tableNumber}`)}} className="toNavy" style={{ padding: '10px'}} >View Cart
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}
            onClick={() => {navigate(`/customer/${props.sessionId}/${props.menuId}/${props.tableNumber}`)}} className="toNavy" style={{ padding: '10px'}} >Go to Menu
          </StyledButton>
          <StyledButton startIcon={<SettingsIcon />}
            onClick={() => {navigate(`/customer/${props.sessionId}/${props.menuId}/${props.tableNumber}/personalise`)}} className="toNavy">Personalise
          </StyledButton>
          <StyledButton startIcon={<BackHandIcon />} onClick={requestAssistance} className="toNavy" style={{ paddingRight: '50px', paddingLeft: '50px' }}>
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
      return null;
    }
  };

  return <FooterContent />;
}

export default Footer;

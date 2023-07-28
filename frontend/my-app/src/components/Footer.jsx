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


function Footer (props) {
  const requestAssistance = () => {
    const body = JSON.stringify({
      table_id: props.tableNumber,
      session_id: props.sessionId,
      menu_id: props.menuId,
    });
    makeRequest('/customer/request_assistance', 'POST', body, undefined)
      .then(data => {
        console.log(data);
      })
      .catch(e => console.log('Error: ' + e));
  }
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
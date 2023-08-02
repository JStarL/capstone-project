import React from 'react';
import '../App.css';
import { Typography, Card, CardActions, CardContent } from '@mui/material';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

function Nav(props) {
  const logout = () => {
    const body = JSON.stringify({
      'staff_id': props.id.toString(),
    })
    makeRequest('/auth/logout', 'POST', body, undefined)
      .then(data => {
      })
      .catch(e => console.log('Error: ' + e))
    props.setId(null);
    props.setStaffType(null);
    props.setIsCustomer(false);
    props.setIsStaff(false)

    localStorage.clear()
  }
  // 
  const StaffNav = () => {
      return (
        <nav sx={{ display: 'flex' }}>
          <div className='links-container' style={{ marginRight: 'auto', marginTop: '5px', marginLeft: '20px' }}>
            <Typography style={{ color: 'white' }} variant="overline" gutterBottom>{props.isManager ? 'Manager' : props.isKitchen ? 'Kitchen Staff' : 'Wait Staff'}</Typography>
          </div>
          <div className='nav-container'>
            <StyledButton sx={{
              margin: '5px',
              marginLeft: 'auto',
              width: '70%',
              height: '70%',
            }} onClick={logout} startIcon={<LogoutIcon />}>
              <a className='toNavy' href='/'>
                Logout
              </a>
            </StyledButton>
          </div>
        </nav>
      )
    }
  
  const CustomerNav = () => {
      return (
        <nav>
          <div className='customer-nav-container' sx={{ zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className='links-container'>
              <span className="link"><Link to='/'>Home</Link></span>
            </div>
            {props.tableNumber ? (<div className='links-container' style={{ marginLeft: 'auto', marginTop: '5px' }}>
              <Typography style={{ color: 'white', marginRight: '50px' }} variant="overline" gutterBottom>Current Persona: {props.personas[props.currentlySelectedPersona][0]}</Typography>
              <Typography style={{ color: 'white' }} variant="overline" gutterBottom>Table Number: {props.tableNumber}</Typography>
              </div>)
            : null}
          </div>
        </nav>
      )
    }
  
  return <>
    {!props.isStaff
      ? <CustomerNav />
      : <StaffNav className='logout-button' onClick={logout}></StaffNav>
    }
    </>;
  }
  export default Nav;
import React from 'react';
import '../App.css';
import { Typography } from '@mui/material';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Represents a navigation component that displays navigation options based on user type (staff or customer).
 * @param {Object} props - The properties passed to the component.
 * @param {string|null} props.id - The ID of the logged-in user (staff).
 * @param {Function} props.setId - A function to set the ID of the logged-in user (staff).
 * @param {string|null} props.staffType - The type of the logged-in staff (e.g., manager, kitchen staff, wait staff).
 * @param {Function} props.setStaffType - A function to set the type of the logged-in staff.
 * @param {boolean} props.isCustomer - A flag indicating if the user is a customer.
 * @param {Function} props.setIsCustomer - A function to set the flag indicating if the user is a customer.
 * @param {boolean} props.isStaff - A flag indicating if the user is a staff member.
 * @param {Function} props.setIsStaff - A function to set the flag indicating if the user is a staff member.
 * @param {boolean} props.isManager - A flag indicating if the logged-in staff is a manager.
 * @param {boolean} props.isKitchen - A flag indicating if the logged-in staff is a kitchen staff.
 * @param {boolean} props.tableNumber - The table number of the customer (if applicable).
 * @param {Array} props.personas - An array of customer personas.
 * @param {number} props.currentlySelectedPersona - The index of the currently selected customer persona.
 * @returns {JSX.Element} The JSX representation of the Nav component.
 */
function Nav(props) {
  const navigate = useNavigate()

  /**
   * Logs out
   */
  const logout = () => {
    const body = JSON.stringify({
      'staff_id': props.id.toString(),
    })
    makeRequest('/auth/logout', 'POST', body, undefined)
      .then(data => {
        navigate('/')
      })
      .catch(e => console.log('Error: ' + e))
    props.setId(null);
    props.setStaffType(null);
    props.setIsCustomer(false);
    props.setIsStaff(false)
  }

  /**
   * Represents the navigation for staff members (manager, kitchen staff, wait staff).
   * @returns {JSX.Element} The JSX representation of the StaffNav component.
   */
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
            padding: '20px',
            paddingRight: '30px',
            paddingLeft: '30px',
            width: '70%',
            height: '70%',
          }} onClick={logout} startIcon={<LogoutIcon />} className='toNavy'>Logout
          </StyledButton>
        </div>
      </nav>
    )
  }

  /**
   * Represents the navigation for customers.
   * @returns {JSX.Element} The JSX representation of the CustomerNav component.
   */
  const CustomerNav = () => {
    return (
      <nav>
        <div className='customer-nav-container' sx={{ zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='links-container'>
            <span className="link"><Link to='/'>Home</Link></span>
          </div>
          {props.tableNumber ? (
            <div className='links-container' style={{ marginLeft: 'auto', marginTop: '5px' }}>
              <Typography style={{ color: 'white', marginRight: '50px' }} variant="overline" gutterBottom>Current Persona: {props.personas[props.currentlySelectedPersona][0]}</Typography>
              <Typography style={{ color: 'white' }} variant="overline" gutterBottom>Table Number: {props.tableNumber}</Typography>
            </div>
          ) : null}
        </div>
      </nav>
    )
  }

  return (
    <>
      {!props.isStaff
        ? <CustomerNav />
        : <StaffNav className='logout-button' onClick={logout}></StaffNav>
      }
    </>
  );
}

export default Nav;

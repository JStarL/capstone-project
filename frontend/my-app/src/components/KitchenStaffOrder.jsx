import React from 'react';
import './Components.css';
import { Typography } from '@mui/material';
import { StyledButton } from '../pages/CustomerOrStaff';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import makeRequest from '../makeRequest';
import DoneIcon from '@mui/icons-material/Done';
import { convertToMinutesAndHours } from './helperFunctions';

/**
 * Represents a component displaying an order assigned to a kitchen staff member.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.menuId - The ID of the menu.
 * @param {string} props.sessionId - The ID of the session.
 * @param {string} props.tableId - The table number of the order.
 * @param {string} props.staffId - The ID of the kitchen staff member.
 * @param {string} props.status - The status of the order (either 'kitchen' or 'cooking').
 * @param {number} props.timestamp - The timestamp when the order was placed.
 * @param {Array} props.menuItems - An array of menu items associated with the order.
 * @param {Function} props.setTrigger - A function to trigger a re-render of the component.
 * @returns {JSX.Element} The JSX representation of the KitchenStaffOrder component.
 */
function KitchenStaffOrder(props) {
  // State variables
  const [timestamp, setTimestamp] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  /**
   * Use Effect hook to update the timestamp state every second using setInterval
   */
  React.useEffect(() => {
    const timer = () => {
      const timeCustomerOrdered = new Date(props.timestamp);
      const timeNow = new Date(Date.now());
      const timeDifference = timeNow - timeCustomerOrdered;
      setTimestamp(timeDifference / 1000);
    };
    const timerFunction = setInterval(timer, 1000);
    convertToMinutesAndHours(timestamp, setMinutes, setSeconds);

    return () => {
      clearInterval(timerFunction);
    };
  }, [timestamp]);

  /**
   * Handles the button click event based on the current order status.
   */
  const handleClick = () => {
    if (props.status === 'kitchen') {
      markCooking();
    } else if (props.status === 'cooking') {
      completeOrder();
    }
  };

  /**
   * Marks the order as currently cooking and updates the status.
   */
  const markCooking = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'table_id': props.tableId,
      'kitchen_staff_id': props.staffId
    });
    makeRequest('/kitchen_staff/mark_currently_cooking', 'POST', body, undefined)
      .then(data => {
        props.setTrigger(!props.trigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  /**
   * Marks the order as complete and updates the status.
   */
  const completeOrder = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'kitchen_staff_id': props.staffId

    });
    makeRequest('/kitchen_staff/mark_order_complete', 'POST', body, undefined)
      .then(data => {
        props.setTrigger(!props.trigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  return (
    <>
      <div className='kitchen-staff-order'>
        <div style={{ width: '60%' }} className='kitchen-staff-order-div'>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}><b>Table Number: {props.tableId}</b></div>
          <div>Time since order was placed: <b>{minutes === 0 ? '' : `${minutes} minute(s) and `} {seconds} second(s)</b> ago</div>
          <div className='kitchen-staff-menu-items-container'>
            {props.menuItems?.map((menuItem) => (
              <div key={menuItem.food_name} className='kitchen-staff-menu-item'>
                <div>
                  {menuItem.image ? (
                    <div>
                      <img
                        style={{ justifyContent: 'center', width: '20vh', height: '20vh', margin: '20px', borderRadius: '10px' }}
                        src={menuItem.image}
                      ></img>
                    </div>
                  ) : (
                    <div className='food-item-img'>IMG</div>
                  )}
                </div>
                <div style={{
                  width: '20vh',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  marginTop: '12px'
                }}>
                  <div className='div-section'>
                    <b>{menuItem.food_name}</b>
                  </div>
                  <div className='div-section'>Amount: {menuItem.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <Typography style={{ padding: '5px' }} variant='overline'>{props.status === 'cooking' ? 'You are cooking this order' : ''}</Typography>
          <StyledButton startIcon={props.status === 'kitchen' ? <RestaurantMenuIcon /> : <DoneIcon />} variant='outlined' onClick={handleClick} style={{ width: '45vw', marginBottom: '2vh' }}>{props.status === 'kitchen' ? 'Start Cooking' : 'Complete Order'}</StyledButton>
        </div>
      </div>
    </>
  );
}

export default KitchenStaffOrder;

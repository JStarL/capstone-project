import React from 'react';
import './Components.css';
import { Typography } from '@mui/material';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import DoneIcon from '@mui/icons-material/Done';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import { convertToMinutesAndHours } from './helperFunctions';

/**
 * Represents a wait staff order component in the staff interface.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.timestamp - The timestamp when the order was finished cooking.
 * @param {string} props.status - The status of the order ('wait' or 'serving').
 * @param {string} props.menuId - The ID of the current menu.
 * @param {string} props.sessionId - The ID of the current session.
 * @param {string} props.tableId - The ID of the table for which the order is being served.
 * @param {string} props.staffId - The ID of the wait staff serving the order.
 * @param {Array} props.menuItems - The array of menu items in the order.
 * @param {boolean} props.orderTrigger - A boolean trigger to re-fetch the order details.
 * @param {Function} props.setOrderTrigger - The callback function to set the order trigger state.
 * @returns {JSX.Element} The JSX representation of the WaitStaffOrder component.
 */
function WaitStaffOrder(props) {
  const [timestamp, setTimestamp] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  /**
   * Handles the click event of the action button based on the status.
   * If status is 'wait', marks the order as serving.
   * If status is 'serving', marks the order as completed.
   */
  const handleClick = () => {
    if (props.status === 'wait') {
      markServing();
    } else if (props.status === 'serving') {
      completeOrder();
    }
  };

  const markServing = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'table_id': props.tableId,
      'wait_staff_id': props.staffId
    });
    makeRequest('/wait_staff/mark_currently_serving', 'POST', body, undefined)
      .then(data => {
        props.setOrderTrigger(!props.orderTrigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

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

  const completeOrder = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
    });
    makeRequest('/wait_staff/mark_order_complete', 'DELETE', body, undefined)
      .then(data => {
        props.setOrderTrigger(!props.orderTrigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  return (
    <>
      <div className='wait-staff-order'>
        <div style={{ width: '100%' }} className='wait-staff-order-div'>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}>
            <b>Table Number: {props.tableId}</b>
          </div>
          <div>Time since order finished cooking: <b>{minutes === 0 ? '' : `${minutes} minute(s) and`} {seconds} second(s)</b> ago</div>
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
          <Typography style={{ marginTop: '10px' }} variant='overline'>{props.status === 'serving' ? 'You are serving this order' : ''}</Typography>
          <StyledButton
            startIcon={props.status === 'wait' ? <BrunchDiningIcon /> : <DoneIcon />}
            variant='outlined'
            onClick={handleClick}
            style={{ width: '30vw', marginTop: '1vh', marginBottom: '2vh' }}
          >
            {props.status === 'wait' ? 'Start Serving' : 'Serving Completed'}
          </StyledButton>
        </div>
      </div>
    </>
  );
}

export default WaitStaffOrder;

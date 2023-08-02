import React from 'react';
import './Components.css';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import { Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

/**
 * Represents a wait staff notifications component in the staff interface.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.timestamp - The timestamp when the assistance was requested.
 * @param {string} props.status - The status of the notification ('customer' or 'wait').
 * @param {string} props.menuId - The ID of the current menu.
 * @param {string} props.sessionId - The ID of the current session.
 * @param {string} props.tableId - The ID of the table requesting assistance.
 * @param {string} props.staffId - The ID of the wait staff providing assistance.
 * @param {boolean} props.notificationTrigger - A boolean trigger to re-fetch the notifications.
 * @param {Function} props.setNotificationTrigger - The callback function to set the notification trigger state.
 * @returns {JSX.Element} The JSX representation of the WaitStaffNotifications component.
 */
function WaitStaffNotifications(props) {
  const [timestamp, setTimestamp] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  /**
   * Converts total seconds to minutes and seconds.
   * @param {number} totalSeconds - The total number of seconds to convert.
   */
  const convertToMinutesAndHours = (totalSeconds) => {
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    setMinutes(minutes);
    setSeconds(seconds);
  };

  React.useEffect(() => {
    const timer = () => {
      const timeCustomerOrdered = new Date(props.timestamp);
      const timeNow = new Date(Date.now());
      const timeDifference = timeNow - timeCustomerOrdered;
      setTimestamp(timeDifference / 1000);
    };
    const timerFunction = setInterval(timer, 1000);
    convertToMinutesAndHours(timestamp);

    return () => {
      clearInterval(timerFunction);
    };
  }, [timestamp]);

  /**
   * Handles the click event of the action button based on the status.
   * If status is 'customer', marks the staff as currently assisting.
   * If status is 'wait', marks the notification as completed.
   */
  const handleClick = () => {
    if (props.status === 'customer') {
      markAssisting();
    } else if (props.status === 'wait') {
      completeNotification();
    }
  };

  /**
   * Marks the staff as currently assisting the table.
   * Sends a request to the server to update the status.
   */
  const markAssisting = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'table_id': props.tableId,
      'wait_staff_id': props.staffId
    });
    makeRequest('/wait_staff/mark_currently_assisting', 'POST', body, undefined)
      .then(data => {
        props.setNotificationTrigger(!props.notificationTrigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  /**
   * Marks the notification as completed.
   * Sends a request to the server to update the status.
   */
  const completeNotification = () => {
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'table_id': props.tableId
    });
    makeRequest('/wait_staff/mark_notification_complete', 'DELETE', body, undefined)
      .then(data => {
        props.setNotificationTrigger(!props.notificationTrigger);
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
          <div>Time since assistance requested: <b>{minutes === 0 ? '' : `${minutes} minute(s) and`} {seconds} second(s)</b> ago</div>
          <Typography style={{ marginTop: '10px' }} variant='overline'>
            {props.status === 'wait' ? 'You are assisting this table' : ''}
          </Typography>
          <StyledButton
            startIcon={props.status === 'customer' ? <PriorityHighIcon /> : <DoneIcon />}
            variant='outlined'
            onClick={handleClick}
            style={{ width: '30vw', marginTop: '1vh', marginBottom: '2vh' }}
          >
            {props.status === 'customer' ? 'Start Assisting' : 'Mark Assistance Completed'}
          </StyledButton>
        </div>
      </div>
    </>
  );
}

export default WaitStaffNotifications;

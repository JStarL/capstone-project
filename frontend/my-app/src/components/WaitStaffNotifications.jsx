import React from 'react';
import './Components.css';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import DoneIcon from '@mui/icons-material/Done';


function WaitStaffNotifications(props) {
  const completeNotification = () => {
    console.log('notification completed');
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
      'table_id': props.tableId
    });
    makeRequest('/wait_staff/mark_notification_complete', 'DELETE', body, undefined)
      .then(data => {
        console.log(data);
        props.setNotificationTrigger(!props.notificationTrigger);
      })
      .catch(e => console.log('Error: ' + e));
  };

  return (
    <>
      <div className='wait-staff-order'>
        <div style={{ width: '100%' }} className='wait-staff-order-div'>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}><b>Table Number: {props.tableId}</b></div>
          <div>Time since assistance requested: TIMESTAMP</div>
        <StyledButton startIcon={<DoneIcon />} variant='outlined' onClick={completeNotification} style={{ width: '30vw', marginTop: '2vh', marginBottom: '2vh' }}>Assistance Completed</StyledButton>
      </div>
    </div>
    </>
  );
}

export default WaitStaffNotifications;


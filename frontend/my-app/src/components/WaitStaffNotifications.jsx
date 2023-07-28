import React from 'react';
import './Components.css';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';


function WaitStaffNotifications(props) {
  const [status, setStatus] = React.useState('none');
  const [timestamp, setTimestamp] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)

  const convertToMinutesAndHours = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    setMinutes(minutes)
    setSeconds(seconds)
  };
  
  React.useEffect(() => {  
    const timer = () => {
      setTimestamp(prevTime => prevTime + 1); // Increment time instead of decrementing
    };
  
    const timerFunction = setInterval(timer, 1000);
    convertToMinutesAndHours(timestamp)

    return () => {
      clearInterval(timerFunction);
    };
  }, [timestamp]);

  const handleClick = () => {
    if (status === 'none') {
      markAssisting();
    } else if (status === 'assisting'){
      completeNotification();
    }
  };

  const markAssisting = () => {
    // console.log('order assisting');
    // const body = JSON.stringify({
    //   'menu_id': props.menuId,
    //   'session_id': props.sessionId,
    //   'table_id': props.tableId
    // });
    // makeRequest('/wait_staff/mark_currently_assisting', 'POST', body, undefined)
    //   .then(data => {
    //     console.log(data);
    //     setStatus('assisting')
    //     props.setNotificationTrigger(!props.notificationTrigger);
    //   })
    //   .catch(e => console.log('Error: ' + e));
      setStatus('assisting')
      props.setNotificationTrigger(!props.notificationTrigger);
  };

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
          <div>Time since assistance requested: <b>{minutes} minute(s) and {seconds} second(s)</b> ago</div>
        <StyledButton startIcon={status === 'none' ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />} variant='outlined' onClick={handleClick} style={{ width: '30vw', marginTop: '2vh', marginBottom: '2vh' }}>{status === 'none' ? 'Start Assisting' : 'Mark Assistance Completed'}</StyledButton>
      </div>
    </div>
    </>
  );
}

export default WaitStaffNotifications;


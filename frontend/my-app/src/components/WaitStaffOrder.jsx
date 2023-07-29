import React from 'react';
import './Components.css';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import DoneIcon from '@mui/icons-material/Done';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';

function WaitStaffOrder(props) {
    const [status, setStatus] = React.useState('none');

  const handleClick = () => {
    if (status === 'none') {
      markServing();
    } else if (status === 'serving'){
      completeOrder();
    }
  };
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

  const markServing = () => {
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
      setStatus('serving')
      props.setOrderTrigger(!props.orderTrigger);
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

  const completeOrder = () => {
    console.log('order completed');
    const body = JSON.stringify({
      'menu_id': props.menuId,
      'session_id': props.sessionId,
    });
    makeRequest('/wait_staff/mark_order_complete', 'DELETE', body, undefined)
      .then(data => {
        console.log(data);
        // setStatus('completed')
      })
      .catch(e => console.log('Error: ' + e));
    props.setOrderTrigger(!props.orderTrigger);
  };

  return (
    <>
      <div className='wait-staff-order'>
        <div style={{ width: '100%' }} className='wait-staff-order-div'>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}><b>Table Number: {props.tableId}</b></div>
          <div>Time since order was placed: <b>{minutes} minute(s) and {seconds} second(s)</b> ago</div>
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
        <StyledButton startIcon={status === 'none' ? <BrunchDiningIcon /> : <DoneIcon />} variant='outlined' onClick={handleClick} style={{ width: '30vw', marginTop: '2vh', marginBottom: '2vh' }}>{status === 'none' ? 'Start Serving' : 'Serving Completed'}</StyledButton>
      </div>
    </div>
    </>
  );
}

export default WaitStaffOrder;


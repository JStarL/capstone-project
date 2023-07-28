import React from 'react';
import './Components.css';
import { StyledButton } from '../pages/CustomerOrStaff';
import makeRequest from '../makeRequest';
import DoneIcon from '@mui/icons-material/Done';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';

function WaitStaffOrder(props) {
  const [timestamp, setTimestamp] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)

  const handleClick = () => {
    if (props.status === 'wait') {
      markServing();
    } else if (props.status === 'serving'){
      completeOrder();
    }
  };
  
  const convertToMinutesAndHours = (totalSeconds) => {
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60)
    setMinutes(minutes)
    setSeconds(seconds)
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
  
    React.useEffect(() => {  
      const timer = () => {
        const timeCustomerOrdered = new Date(props.timestamp);
        const timeNow = new Date(Date.now());
        const timeDifference = timeNow - timeCustomerOrdered
        setTimestamp(timeDifference / 1000);
      };
      const timerFunction = setInterval(timer, 1000);
      convertToMinutesAndHours(timestamp)
  
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2em', marginTop: '30px' }}><b>Table Number: {props.tableId}</b></div>
          <div>Time since order finished cooking: <b>{minutes} minute(s) and {seconds} second(s)</b> ago</div>
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
        <StyledButton startIcon={props.status === 'wait' ? <BrunchDiningIcon /> : <DoneIcon />} variant='outlined' onClick={handleClick} style={{ width: '30vw', marginTop: '2vh', marginBottom: '2vh' }}>{props.status === 'wait' ? 'Start Serving' : 'Serving Completed'}</StyledButton>
      </div>
    </div>
    </>
  );
}

export default WaitStaffOrder;


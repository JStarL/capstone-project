import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import WaitStaffOrder from '../components/WaitStaffOrder'
import WaitStaffNotifications from '../components/WaitStaffNotifications';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BackHandIcon from '@mui/icons-material/BackHand';

function WaitStaffPage() {
  const [orderList, setOrderList] = React.useState([]);
  const [notificationsList, setNotificationsList] = React.useState([]);
  const [orderTrigger, setOrderTrigger] = React.useState(true);
  const [notificationTrigger, setNotificationTrigger] = React.useState(true);

  const params = useParams();

  const menuId = params.menuId;
  const staffId = params.staffId;

  React.useEffect(() => {
    async function fetchData() {
      await getOrderList();
      console.log('orders refresh')
    }
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [orderTrigger])

  React.useEffect(() => {
    async function fetchData() {
      await getNotificationList();
      console.log('notifications refresh')
    }
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };

  }, [notificationTrigger])

  async function getOrderList() {
    const url = `/wait_staff/get_order_list?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setOrderList(data);
  }

  async function getNotificationList() {
    const url = `/wait_staff/get_assistance_notifications?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setNotificationsList(data);
  }

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '60%', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1em' }}>
            <PendingActionsIcon style={{fontSize: '2rem', margin: '10px'}}/><Typography fontSize='1.5em' variant="overline"><b>Pending Orders</b></Typography>
          </div>
          {orderList.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <Typography style={{
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
                borderRadius: '10px',
                padding: '1vw',
                width: 'auto',
                textAlign: 'center', // Center the text horizontally
              }} variant="h6" gutterBottom>No Pending orders at the moment</Typography>
            </div>
          ) : (
            orderList.map((order, index) => (
              <WaitStaffOrder
                key={index}
                menuId={menuId}
                staffId={staffId}
                tableId={order.table_id}
                menuItems={order.menu_items}
                sessionId={order.session_id}
                orderTrigger={orderTrigger}
                setOrderTrigger={setOrderTrigger}
              />
            ))
          )}
        </div>
        <div style={{ width: '40%', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1em' }}>
            <BackHandIcon style={{fontSize: '1.7rem', margin: '10px'}} /><Typography fontSize='1.5em' variant="overline"><b>Require Assistance</b></Typography></div>
          {notificationsList.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <Typography style={{
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
                borderRadius: '10px',
                padding: '1vw',
                width: 'auto',
                textAlign: 'center', // Center the text horizontally
              }} variant="h6" gutterBottom>No customers need assistance at the moment</Typography>
            </div>
          ) : (
            notificationsList.map((notification, index) => (
              <WaitStaffNotifications
                key={index}
                menuId={menuId}
                staffId={staffId}
                tableId={notification.table_id}
                sessionId={notification.session_id}
                notificationTrigger={notificationTrigger}
                setNotificationTrigger={setNotificationTrigger}
              />
            ))
          )}
        </div>
      </div>

    </>
  );
}

export default WaitStaffPage;

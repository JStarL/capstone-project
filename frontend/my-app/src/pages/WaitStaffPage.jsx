import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';
import makeRequest from '../makeRequest';
import KitchenStaffOrder from '../components/KitchenStaffOrder';

function WaitStaffPage() {
  const [orderList, setOrderList] = React.useState([])
  const [notificationsList, setNotificationsList] = React.useState([])
  const [orderTrigger, setOrderTrigger] = React.useState(true)
  const [notificationTrigger, setNotificationTrigger] = React.useState(true)

  const params = useParams()
  
  const menuId = params.menuId
  const staffId = params.staffId
  console.log(typeof(staffId))
  React.useEffect(() => {
    async function fetchData() {
      await getOrderList();
      console.log('orders refresh')
    }
    fetchData();
  }, [orderTrigger])

  React.useEffect(() => {
    async function fetchData() {
      await getNotificationList();
      console.log('notifications refresh')
    }
    fetchData();
  }, [notificationTrigger])

  async function getOrderList() {
    const url = `/wait_staff/get_order_list?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setOrderList(data)
    console.log(data)
  }

  async function getNotificationList() {
    const url = `/wait_staff/get_assistance_notifications?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setNotificationsList(data)
    console.log(data)
  }
  return (
  <>
    <div>Wait Staff Page</div>
    {orderList?.map((order) => (
      <KitchenStaffOrder
        tableId={order.table_id}
        menuItems={order.menu_items}
        sessionId={order.session_id}
        orderTrigger={orderTrigger}
        setOrderTrigger={setOrderTrigger}
      >
      </KitchenStaffOrder>
      ))}
  </>
  );
}

export default WaitStaffPage;

import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';
import makeRequest from '../makeRequest';
import KitchenStaffOrder from '../components/KitchenStaffOrder';

function KitchenStaffPage() {
  const [orderList, setOrderList] = React.useState([])
  const [trigger, setTrigger] = React.useState(true)
  const params = useParams()
  
  const menuId = params.menuId
  const staffId = params.staffId
  console.log(typeof(staffId))
  // React.useEffect(() => {
  //   async function fetchData() {
  //     await getOrderList();
  //     console.log('refresh')
  //   }
  //   fetchData();
  // }, [trigger])

  React.useEffect(() => {
    async function fetchData() {
      await getOrderList();
      console.log('refresh');
    }

    // Call fetchData initially
    fetchData();

    // Setup an interval to call fetchData every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [trigger]);

  async function getOrderList() {
    const url = `/kitchen_staff/get_order_list?menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined);
    setOrderList(data)
    console.log(data)
  }
  return (
  <>
    <div>Kitchen Staff Page</div>
    {orderList?.map((order) => (
      <KitchenStaffOrder
        tableId={order.table_id}
        menuItems={order.menu_items}
        sessionId={order.session_id}
        trigger={trigger}
        setTrigger={setTrigger}
      >
      </KitchenStaffOrder>
      ))}
  </>
  );
}

export default KitchenStaffPage;

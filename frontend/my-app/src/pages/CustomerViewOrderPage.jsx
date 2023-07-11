import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import OrderItem from '../components/OrderItem';
import { StyledButton } from './CustomerOrStaff';

function CustomerViewOrderPage() {
    const [orders, setOrders] = React.useState([])
	const params = useParams();
    const menuId = params.menuId;
    const sessionId = params.sessionId;

    React.useEffect(() => {
      async function fetchData() {
        const data = await fetchOrder();
        // setOrders(data.menu_items)
        console.log(data.menu_items)
      }
      fetchData();
      }, [])
    
    async function fetchOrder() {
      const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
      const data = await makeRequest(url, 'GET', undefined, undefined)
      console.log(data.menu_items)
      setOrders(data.menu_items)
      return data;
    }
	return (
    <>
    <div>CUSTOMER VIEW ORDER</div>
		<div className='view-order-page' style={{ justifywidth: '100%', alignItems:'center' }} sx={{ alignItems: 'center' }}>
    {orders?.map((order) => (
        <OrderItem
          amount={order.amount}
          menu_item_id={order.menu_item_id}
          foodName={order.title}
          fetchOrder={fetchOrder}
        >
        </OrderItem>
      ))}
		</div>
    <StyledButton onClick={() => console.log('finalise order')} style={{ width: '70%'}}>Finalise Order</StyledButton>
    </>
	);
}

export default CustomerViewOrderPage;

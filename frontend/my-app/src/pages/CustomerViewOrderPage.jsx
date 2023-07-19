import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import OrderItem from '../components/OrderItem';
import { StyledButton } from './CustomerOrStaff';

function CustomerViewOrderPage() {
  const [orders, setOrders] = React.useState([])
  const [totalCost, setTotalCost] = React.useState(0)
	const params = useParams();
  const menuId = params.menuId;
  const sessionId = params.sessionId;

  React.useEffect(() => {
    async function fetchData() {
      await fetchOrder();
    }
    fetchData();
    setTotalCost(0)
  }, [])

  React.useEffect(() => {
    let total = 0
    orders?.map((order) => {
      const subtotal = order.price * order.amount;
      total += subtotal;
      setTotalCost(total);
    })
    if (orders.length === 0) {
      setTotalCost(0)
    }
  }, [orders])
  
  async function fetchOrder() {
    const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setOrders(data.menu_items)
    return data;
  }

  
  if (!orders || !Array.isArray(orders)) return <>loading...</>;

	return (
    <>
    <div>YOUR ORDER</div>
    <Typography variant="overline" gutterBottom><b>Table Number: {params.tableNumber}</b></Typography>
		<div className='view-order-page' style={{ justifywidth: '100%', alignItems:'center' }} sx={{ alignItems: 'center' }}>
    {orders?.map((order) => (
        <OrderItem
          amount={order.amount}
          menu_item_id={order.menu_item_id}
          foodName={order.title}
          foodDescription={order.description}
          foodImage={order.image}
          foodPrice={order.price}
          fetchOrder={fetchOrder}
          setTotalCost={setTotalCost}
        >
        </OrderItem>
      ))}
		</div>
    <Typography style={{ padding: '5px', margin: '20px' }}><b>Total: ${totalCost}</b></Typography>
    <StyledButton onClick={() => console.log('finalise order')} style={{ width: '70%'}}>Finalise Order</StyledButton>
    </>
	);
}

export default CustomerViewOrderPage;

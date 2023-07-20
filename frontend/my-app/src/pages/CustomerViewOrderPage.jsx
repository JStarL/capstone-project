import React from 'react';
import { Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import makeRequest from '../makeRequest';
import OrderItem from '../components/OrderItem';
import { StyledButton } from './CustomerOrStaff';

function CustomerViewOrderPage() {
  const [orders, setOrders] = React.useState([])
  const [totalCost, setTotalCost] = React.useState(0)
	const params = useParams();
  const menuId = params.menuId;
  const sessionId = params.sessionId;
  const tableId = params.tableNumber;
  const navigate = useNavigate();

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

  function finaliseOrder() {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId
    });
    makeRequest('/customer/finalise_order', 'POST', body, undefined)
      .then(data => {
        console.log(data);
        navigate(`/customer/${sessionId}/${menuId}/${tableId}`);
      })
      .catch(e => console.log('Error: ' + e));
  }
  
  if (!orders || !Array.isArray(orders)) return <>loading...</>;

	return (
    <>
    <div><b>YOUR ORDER</b></div>
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
    <StyledButton onClick={() => finaliseOrder()} style={{ width: '70%'}}>Finalise Order</StyledButton>
    </>
	);
}

export default CustomerViewOrderPage;

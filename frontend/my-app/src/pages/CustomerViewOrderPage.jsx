import React from 'react';
import { Typography, Button, styled } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import makeRequest from '../makeRequest';
import OrderItem from '../components/OrderItem';

/**
 * Represents the CustomerViewOrderPage that displays the customer's order details.
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.personas - An object containing information about different personas
 * @param {number} props.currentlySelectedPersona - The currently selected persona.
 * @param {function} props.handleExcludeCategories - A function to handle excluded categories when selecting a persona.
 * @returns {JSX.Element} The JSX representation of the CustomerViewOrderPage component.
 */
function CustomerViewOrderPage(props) {
  // State variables
  const [orders, setOrders] = React.useState([])
  const [totalCost, setTotalCost] = React.useState(0)
  
  // Extract menuId, sessionId and tableId from the URL params
  const params = useParams();
  const menuId = params.menuId;
  const sessionId = params.sessionId;
  const tableId = params.tableNumber;

  const navigate = useNavigate();

  const StyledButton = styled(Button)({
    backgroundColor: orders.length === 0 ? 'grey' : '#002250',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#002250',
    },
    width: '70%'
  });

  /**
   * Use Effect hook to fetch data and intialise totalCost state variable to 0
   */
  React.useEffect(() => {
    async function fetchData() {
      await fetchOrder();
    }
    fetchData();
    setTotalCost(0)
  }, [])

  /**
   * Use Effect hook to calculate and update the total cost of orders
   */
  React.useEffect(() => {
    let total = 0
    orders?.map((order) => {
      const subtotal = order.price * order.amount;
      total += subtotal;
      setTotalCost(total.toFixed(2));
    })
    if (orders.length === 0) {
      setTotalCost(0)
    }
  }, [orders])
  
  /**
   * Fetches the customer's order details for the specified session and menu.
   * @returns {Object} The order data containing menu_items.
   */
  async function fetchOrder() {
    const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
    const data = await makeRequest(url, 'GET', undefined, undefined)
    setOrders(data.menu_items)
    return data;
  }

  /**
   * Handles the finalization of the customer's order and navigates to the payment page.
   */
  function finaliseOrder() {
    const body = JSON.stringify({
      'session_id': sessionId,
      'menu_id': menuId
    });
    makeRequest('/customer/finalise_order', 'POST', body, undefined)
      .then(data => {
        navigate(`/customer/${sessionId}/view_order/${menuId}/${tableId}/pay`);
      })
      .catch(e => console.log('Error: ' + e));
  }
  
  if (!orders || !Array.isArray(orders)) return <>loading...</>;

  return (
    <>
      <Typography className='h4' variant="overline" style={{fontSize: '2rem', margin: '10px'}} gutterBottom><b>Your Order</b></Typography>
      <div className='view-order-page' style={{justifywidth: '100%', alignItems:'center' }}>
        {orders.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Typography style={{
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
              borderRadius: '10px',
              padding: '1vw',
              width: 'auto',
              textAlign: 'center',
            }} variant="overline" gutterBottom>No Menu Items in Cart</Typography>
          </div>
        ) : (
          orders?.map((order, index) => (
            <OrderItem
              key={index}
              amount={order.amount}
              menu_item_id={order.menu_item_id}
              foodName={order.title}
              foodDescription={order.description}
              foodImage={order.image}
              foodPrice={order.price}
              foodCategoryId={order.category_id}
              fetchOrder={fetchOrder}
              setTotalCost={setTotalCost}
              orderedByPersona={order.persona}
              personas={props.personas}
              currentlySelectedPersona={props.currentlySelectedPersona}
              handleExcludeCategories={props.handleExcludeCategories}
            >
            </OrderItem>
          )))}
      </div>
      <Typography variant="h4" style={{ padding: '5px', margin: '20px' }}><b>Total: ${totalCost}</b></Typography>
      <StyledButton disabled={orders.length === 0} onClick={() => finaliseOrder()}>Finalise Order</StyledButton>
    </>
  );
}

export default CustomerViewOrderPage;

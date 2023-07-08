import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import OrderItem from '../components/OrderItem';

function CustomerViewOrderPage() {
    const [orders, setOrders] = React.useState([])
	const params = useParams();
    const menuId = params.menuId;
    const sessionId = params.sessionId;

    React.useEffect(() => {
        const data = fetchOrder();
        setOrders(data)
      }, [])
    
    async function fetchOrder() {
        const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
        const data = await makeRequest(url, 'GET', undefined, undefined)
        console.log(data)
        return data;
    }
	return (
        <>
        <div>CUSTOMER VIEW ORDER</div>
		<div className='login-page' style={{ width: '100%' }}sx={{ alignItems: 'center' }}>
            <OrderItem />
		</div></>
	);
}

export default CustomerViewOrderPage;

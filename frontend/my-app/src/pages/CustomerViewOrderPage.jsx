import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';

function CustomerViewOrderPage() {
    const [orders, setOrders] = React.useState([])
	const params = useParams();
    const menuId = params.menuId;
    const sessionId = params.sessionId;

    React.useEffect(() => {
        fetchOrder();
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
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '40%' }}>
				Food Details
			</Paper>
		</div></>
	);
}

export default CustomerViewOrderPage;

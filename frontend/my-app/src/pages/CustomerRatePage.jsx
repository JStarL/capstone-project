import React from 'react';
import '../App.css';
import { Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import StarsIcon from '@mui/icons-material/Stars';
import RatingItem from '../components/RatingItem';
import { StyledButton } from './CustomerOrStaff';

function CustomerRatePage(props) {
	const params = useParams();
	const tableId = params.tableNumber;
	const sessionId = params.sessionId;
	const menuId = params.menuId;
	const [orders, setOrders] = React.useState([])

	React.useEffect(() => {
		async function fetchData() {
			await fetchOrder();
		}
		fetchData();
	}, [])

	async function fetchOrder() {
		const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
		const data = await makeRequest(url, 'GET', undefined, undefined)
		setOrders(data.menu_items)
		// console.log(data.menu_items)
		return data;
	}

	return (
		<>
			<Typography sx={{ mb: 3 }} variant="h3" gutterBottom>
				Rate my meal <StarsIcon sx={{ fontSize: '4rem', verticalAlign: 'middle', marginBottom: '10px' }} />
			</Typography>
			<div className='view-order-page' style={{ justifywidth: '100%', alignItems: 'center' }}>
				{orders?.map((order, index) => (
					<RatingItem
						key={index}
						amount={order.amount}
						menu_item_id={order.menu_item_id}
						foodName={order.title}
						foodDescription={order.description}
						foodImage={order.image}
						foodPrice={order.price}
						orderedByPersona={order.persona}
						personas={props.personas}
					>
					</RatingItem>
				))}
			</div>
		</>
	)
}

export default CustomerRatePage;

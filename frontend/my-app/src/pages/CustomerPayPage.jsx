import React from 'react';
import '../App.css';
import { Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { StyledRadio } from '../components/NewStaffForm';
import { useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';

function CustomerPayPage(props) {
	const [paymentType, setPaymentType] = React.useState('group');
	const params = useParams();
	const tableId = params.tableNumber;
	const sessionId = params.sessionId;
	const menuId = params.menuId;
	const [totalPrice, setTotalPrice] = React.useState(null);
	const [personaPrices, setPersonaPrices] = React.useState({});

	React.useEffect(() => {
		fetchData();
	}, [paymentType]);

	const fetchData = async () => {
		if (paymentType === 'group') {
			setTotalPrice(await calculateTotalPay())
		} else if (paymentType === 'persona') {
			const totalPayData = await calculatePersonaPay();
			setPersonaPrices(totalPayData);
		}
	};

	const calculateTotalPay = async () => {
		const payData = await calculatePersonaPay();

		let totalPrice = 0;

		// Loop through each key-value pair in the payData object
		for (const [persona, price] of Object.entries(payData)) {
			console.log(price)	
			totalPrice += Number(price);
		}
		return totalPrice;
	};

	const calculatePersonaPay = async () => {
		let payData = {};
		const url = `/customer/view_order?session_id=${sessionId}&menu_id=${menuId}`;
		let order = await makeRequest(url, 'GET', undefined, undefined);
		const menu_items_list = order['menu_items'];
		menu_items_list.forEach((val) => {
			if (payData.hasOwnProperty(val['persona'])) {
				payData[val['persona']] += Number(val['amount']) * Number(val['price']);
			} else {
				payData[val['persona']] = Number(val['amount']) * Number(val['price']);
			}
		});

		return payData;
		/**
		 * payData data sructure example:
		 * {
		 *  'default': '12.5',
		 *  'persona 1': 37,
		 *  'some other name': 42
		 * }
		 */
	};

	return (
		<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '50%' }}>
				<Typography sx={{ mb: 3 }} variant="h3" gutterBottom>
					My Bill <ReceiptLongIcon sx={{ fontSize: '4rem', verticalAlign: 'middle', marginBottom: '10px' }} />
				</Typography>
				<Typography sx={{ mb: 3 }} variant="h5" gutterBottom>Please go to the front counter to pay</Typography>
				<Typography sx={{ mb: 3 }} variant="h5" gutterBottom><b>Table Number:</b> {tableId}</Typography>
				<FormControl>
					<FormLabel id="payment-type">
						<Typography sx={{ mb: 3, fontWeight: 'bold' }} variant="h5" gutterBottom>Payment Options:</Typography>
					</FormLabel>
					<RadioGroup
						row
						aria-labelledby="payment-type"
						name="row-staff-type-group"
						value={paymentType}
						onChange={e => setPaymentType(e.target.value)}
					>
						<FormControlLabel value="group" control={<StyledRadio />} label="Pay as a group" />
						<FormControlLabel value="persona" control={<StyledRadio />} label="Pay by persona" />
					</RadioGroup>
				</FormControl>
				{paymentType === 'group' && (
					<Typography sx={{ m: 3 }} variant="h5" gutterBottom>
						<b>Total Price:</b> ${totalPrice}
					</Typography>
				)}
				{paymentType === 'persona' && (
					<>
						{Object.entries(personaPrices).map(([persona, price]) => (
							<Typography key={persona} sx={{ m: 3 }} variant="h5" gutterBottom>
								<b>{props.personas[persona]}:</b> ${price}
							</Typography>
						))}
					</>
				)}
			</Paper>
		</div>
	);
}

export default CustomerPayPage;

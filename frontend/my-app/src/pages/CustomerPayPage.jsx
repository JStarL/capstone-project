import React from 'react';
import '../App.css';
import { TextField, Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel, Snackbar, Alert } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { StyledRadio } from '../components/NewStaffForm';

function CustomerPayPage() {
	const tableNumber = localStorage.getItem('table_number')
	const [paymentType, setPaymentType] = React.useState('group')

	return (
		<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '50%' }}>
				<Typography sx={{ mb: 3 }} variant="h3" gutterBottom>
					My Bill <ReceiptLongIcon sx={{ fontSize: '4rem', verticalAlign: 'middle' }} />
				</Typography>
				<Typography sx={{ mb: 3 }} variant="h5" gutterBottom>Please go to the front counter to pay</Typography>
				<Typography sx={{ mb: 3 }} variant="h5" gutterBottom><b>Table Number:</b> {tableNumber}</Typography>
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
				<Typography sx={{ m: 3 }} variant="h5" gutterBottom><b>Total Price:</b></Typography>
			</Paper>
		</div>
	);
}

export default CustomerPayPage;

import React from 'react';
import { Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';

function CustomerViewOrderPage() {
	const navigate = useNavigate();

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

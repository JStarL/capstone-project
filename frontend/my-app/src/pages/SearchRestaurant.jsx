import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';

function SearchRestaurant() {
	const navigate = useNavigate();
	const [menuId, setMenuId] = React.useState(1) 

	function selectRestaurant() {
		// set menu id in local storage 
		localStorage.setItem('menu_id', menuId)
		// forward user to select table number 
		navigate('/tablenumber')
	}

	return (
		<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '40%' }}>
				<Typography sx={{ mb: 3 }} variant="h4" gutterBottom>Search Restaurant at the moment just defaults to menu_id: 1</Typography>
				<StyledButton sx={{ m: 2, width: '100%' }} variant="outlined" onClick={() => selectRestaurant()}>
					Confirm
				</StyledButton>
			</Paper>
		</div>
	);
}

export default SearchRestaurant;

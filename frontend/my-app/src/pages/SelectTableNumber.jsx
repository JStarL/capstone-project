import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';

function SelectTableNumber() {
	const navigate = useNavigate();
	const [tableNumber, setTableNumber] = React.useState('');

	function selectTableNumber() {
		// set menu id in local storage 
		localStorage.setItem('table_number', tableNumber)
		// forward user to select table number 
		navigate(`/customer/${localStorage.getItem('menu_id')}`)	
	}
	return (
		<div className='login-page' sx={{ alignItems: 'center' }}>
			<Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '40%' }}>
				<Typography sx={{ mb: 3 }} variant="h4" gutterBottom>Please input your table number</Typography>
				<Grid container spacing={2} justifyContent="space-evenly">
					<Grid item>
						<TextField
							label="Table Number"
							type="number"
							inputProps={{ min: 0 }}
							sx={{m:2, width: '100%'}}
							value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
						/>
						<StyledButton sx={{m:2, width:'100%'}} variant="outlined" onClick={() => selectTableNumber()}>
							Confirm
						</StyledButton>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
}

export default SelectTableNumber;

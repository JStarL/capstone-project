import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';
import makeRequest from '../makeRequest';

/**
 * Represents the SelectTableNumber component that allows customers to input their table number.
 * @param {Object} props - The props object that contains the onSuccess function.
 * @param {Function} props.onSuccess - A function to be called upon successful table number selection.
 * @returns {JSX.Element} The JSX representation of the SelectTableNumber component.
 */
function SelectTableNumber({ onSuccess }) {
	const navigate = useNavigate();
	const [tableNumber, setTableNumber] = React.useState('');
	const params = useParams();
	const menuId = params.menuId;
	const sessionId = params.sessionId;

	/**
	 * Handles the selection of the table number.
	 */
	function selectTableNumber() {
		if (tableNumber === '') {
			alert('Table Number cannot be empty');
			return;
		}
		const body = JSON.stringify({
			session_id: sessionId,
			menu_id: menuId,
			table_id: tableNumber,
		});
		makeRequest('/customer/menu/table', 'POST', body, undefined)
			.then(data => {
				// forward user to select table number
				onSuccess(tableNumber);
				navigate(`/customer/${sessionId}/${menuId}/${tableNumber}`);
			})
			.catch(e => console.log('Error: ' + e));
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
							sx={{ m: 2, width: '100%' }}
							value={tableNumber}
							onChange={e => setTableNumber(e.target.value)}
						/>
						<StyledButton sx={{ m: 2, width: '100%' }} variant="outlined" onClick={selectTableNumber}>
							Confirm
						</StyledButton>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
}

export default SelectTableNumber;

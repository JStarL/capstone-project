import React from 'react';
import { TextField, Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel, Snackbar, Alert } from '@mui/material';
import makeRequest from '../makeRequest';
import { StyledButton } from '../pages/CustomerOrStaff';
import { useParams } from 'react-router-dom';

import { styled } from '@mui/material';

export const StyledRadio = styled(Radio)({
	color: 'black', // Replace with your desired color
	'&.Mui-checked': {
		color: '#002250', // Replace with your desired color when the radio button is checked
	}
})

function NewStaffForm({ onSuccess }) {
	const [name, setName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [staffType, setStaffType] = React.useState('kitchen')
	const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

	const params = useParams()
	const managerId = params.managerId
	const menuId = params.menuId

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	function addNewStaff() {
		const body = JSON.stringify({
			'manager_id': managerId,
			'staff_type': staffType,
			'menu_id': menuId,
			email,
			password,
			name,
		})
		makeRequest('/manager/add_staff', 'POST', body, undefined)
			.then(data => {
				if (data.hasOwnProperty('success')) {
					// onSuccess(name, staffType)
					setSnackbarOpen(true);
					// console.log(data)
					setName('')
					setEmail('')
					setPassword('')
					// setStaffType('kitchen')
				}
			})
			.catch(e => console.log('Error: ' + e))
			
		
	}

	return (
		<>
			<div className='login-page'>
				<Paper sx={{ p: 4, borderRadius: '20px', width: "40%" }} className='paper' elevation={5}>
					<form className='login-form'>
						<Typography className='h4' variant="h4" gutterBottom>Add New Staff</Typography>
						<TextField label='Name'
							onChange={e => setName(e.target.value)}
							required
							variant="outlined"
							sx={{ mb: 3 }}
							fullWidth
							value={name}
						/>
						<TextField label='Email'
							onChange={e => setEmail(e.target.value)}
							required
							variant="outlined"
							type="email"
							sx={{ mb: 3 }}
							fullWidth
							value={email}
						/>
						<TextField
							label='Password'
							id='login-password'
							onChange={e => setPassword(e.target.value)}
							required
							variant="outlined"
							color="primary"
							type="password"
							sx={{ mb: 3 }}
							fullWidth
							value={password}
						/>

						<FormControl>
							<FormLabel id="staff-type">Staff Type</FormLabel>
							<RadioGroup
								row
								aria-labelledby="staff-type"
								name="row-staff-type-group"
								value={staffType}
								onChange={e => setStaffType(e.target.value)}
							>
								<FormControlLabel value="kitchen" control={<StyledRadio />} label="Kitchen" />
								<FormControlLabel value="wait" control={<StyledRadio />} label="Wait" />
							</RadioGroup>
						</FormControl>
					</form>
					<StyledButton sx={{ mb: 2, p: 1.5, width: "95%" }} variant="outlined" onClick={addNewStaff}>Add Staff</StyledButton>
					<br /><br />
				</Paper>

				<Snackbar
					sx={{
						width: '50%',
						'& .MuiSnackbarContent-root': {
							fontSize: '1.2rem',
						},
					}}
					open={isSnackbarOpen}
					autoHideDuration={4000}
					onClose={handleSnackbarClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert onClose={handleSnackbarClose} severity="success" sx={{ fontSize: '2rem', width: 'auto' }}>
						{`Successfully registered as a `}
						<Typography variant="inherit" fontWeight="bold" display="inline">
							{staffType === 'kitchen' ? 'Kitchen' : 'Wait'} Staff
						</Typography>
					</Alert>
				</Snackbar>
			</div>
		</>
	);
}

export default NewStaffForm;

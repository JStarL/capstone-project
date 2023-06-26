import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';

function NewStaffForm() {
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [staffType, setStaffType] = React.useState('Kitchen')
	const navigate = useNavigate();

	return <>
		<div className='login-page'>
			<Paper className='paper' elevation={3}>
				<form className='login-form'>
					<Typography className='h4' variant="h4" gutterBottom>Add New Staff</Typography>
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
						<FormControlLabel value="Kitchen" control={<Radio />} label="Kitchen" />
						<FormControlLabel value="Wait" control={<Radio />} label="Wait" />
					</RadioGroup>
				</FormControl>
				</form>
					<Button onClick={() => navigate('/manager/menu')}>Add Staff</Button>
					<br /><br />
			</Paper>
			
		</div>
	</>
}

export default NewStaffForm;
import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CustomerOrStaff() {
	const navigate = useNavigate();

	function selectCustomer () {
		// create a session ID 
		const timestamp = Math.floor(Date.now() / 1000); 
		localStorage.setItem('session_id', timestamp);
		console.log(timestamp);
		navigate('/customer/1')
	}

  return (
    <div className='login-page'>
      <Paper className='paper' elevation={3} sx={{ p: 5 }}>
        <Typography className='h4' variant="h4" gutterBottom>Are you a</Typography>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems:'center' }}>
          <div onClick={() => selectCustomer()} style={{ border: '1px solid black', padding: '100px', margin: '10px' }}>
            Customer
          </div>
          <div onClick={() => navigate('/login')} style={{ border: '1px solid black', padding: '100px', margin: '10px' }}>
            Staff
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default CustomerOrStaff;


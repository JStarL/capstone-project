import React from 'react';
import { Typography, Paper, Grid, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DiningIcon from '@mui/icons-material/Dining';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export const StyledButton = styled(Button)({
  backgroundColor: '#002250',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
    color: '#002250',
  },
  width: '100%'
});

function CustomerOrStaff() {
  const navigate = useNavigate();

  function selectCustomer() {
    const timestamp = Math.floor(Date.now() / 1000);
    localStorage.setItem('session_id', timestamp);
    console.log(timestamp);
    navigate('/searchrestaurant');
  }

  return (
    <div className='login-page' sx={{alignItems: 'center'}}>
      <Paper elevation={10} sx={{ p: 6, borderRadius: '20px', width: '40%'}}>
        <Typography sx={{ mb: 3 }} variant="h4" gutterBottom>Are you a</Typography>
        <Grid container spacing={2} justifyContent="space-evenly">
          <Grid item>
            <StyledButton sx={{ p:7 }} variant="outlined" onClick={selectCustomer}>
              <DiningIcon />
              &nbsp;
              Customer
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton sx={{ p:7 }} variant="outlined" onClick={() => navigate('/login')}>
              <SupervisorAccountIcon />
              &nbsp;
              Staff
            </StyledButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default CustomerOrStaff;

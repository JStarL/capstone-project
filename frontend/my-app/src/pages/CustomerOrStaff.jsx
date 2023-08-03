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

/**
 * Represents the CustomerOrStaff component that allows users to select whether they are a customer or staff.
 * @param {Object} props - The props passed to the component.
 * @param {function} props.onSuccess - The callback function to handle successful selection.
 * @param {function} props.reset - The callback function to reset the component.
 * @returns {JSX.Element} The JSX representation of the CustomerOrStaff component.
 */
function CustomerOrStaff({ onSuccess, reset }) {
  const navigate = useNavigate();

  /**
   * Use Effect hook to initialise all variables to null
   */
  React.useEffect(function () {
    reset(null, null, null, null)
  }, []);

  /**
   * Handles the selection of the customer option.
   */
  function selectCustomer() {
    const timestamp = Math.floor(Date.now() / 1000);
    onSuccess('customer', timestamp)
    navigate(`/customer/${timestamp}/searchrestaurant`);
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

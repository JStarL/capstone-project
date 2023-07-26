import React from 'react';
import { Typography, Paper, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledButton } from './CustomerOrStaff';
import makeRequest from '../makeRequest';

function WaitStaffPage({ customerToWait }) {
  React.useEffect(() => {
  }, []) 
	return (
    <>
		  <div>Wait Staff Page</div>
    </>
	);
}

export default WaitStaffPage;

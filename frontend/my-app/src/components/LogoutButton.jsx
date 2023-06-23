import React from 'react';
import './Components.css';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function LogoutButton () {
  return <>
  <Button startIcon={<LogoutIcon/>}>Logout</Button>
  </>
}

export default LogoutButton;
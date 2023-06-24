import React from 'react';
import './Components.css';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';


function LogoutButton ({ logout }) {
  return <>
    <Button onClick={logout} startIcon={<LogoutIcon/>}><Link to='/'>Logout</Link></Button>
  </>
}

export default LogoutButton;
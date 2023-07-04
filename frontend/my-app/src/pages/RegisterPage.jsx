import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper } from '@mui/material';
import makeRequest from '../makeRequest.jsx'
import { StyledButton } from './CustomerOrStaff';

function RegisterPage({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('');
  const [restaurantName, setRestaurantName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const navigate = useNavigate();

  function register() {
    const body = JSON.stringify({
      email,
      name,
      password,
      restaurant_name: restaurantName,
      location
    })
    makeRequest('/auth/register', 'POST', body, undefined)
      .then(data => {
        if (data.hasOwnProperty('success')) {
          onSuccess(data['staff_id'])
          localStorage.setItem('staff_id', data['manager_id']);
          localStorage.setItem('menu_id', data['menu_id']);
          localStorage.setItem('staff_type', 'manager');
          navigate('/manager/menu/1')
        } else {
          alert(data['error'])
        }
      })
      .catch(e => console.log('Error: ' + e))
  }

  return <>
    <div className='login-page'>
      <Paper sx={{ p: 4, borderRadius: '20px', width: "40%" }} elevation={5}>
        <form className='login-form'>
          <Typography className='h4' variant="h4" gutterBottom>Register Page</Typography>
          <TextField label='Email'
            onChange={e => setEmail(e.target.value)}
            required
            variant="outlined"
            type="email"
            sx={{ mb: 3 }}
            fullWidth
            value={email}
          />
          <TextField label='Name'
            onChange={e => setName(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 3 }}
            fullWidth
            value={name}
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
          <TextField label='Restaurant Name'
            onChange={e => setRestaurantName(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 3 }}
            fullWidth
            value={restaurantName}
          />
          <TextField label='Location'
            onChange={e => setLocation(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 3 }}
            fullWidth
            value={location}
          />
          <StyledButton variant="outlined" sx={{ mb: 2, p:1.5, width: "100%" }} onClick={register}>Register</StyledButton>
        </form>
      </Paper>
    </div>
  </>;
}

export default RegisterPage;

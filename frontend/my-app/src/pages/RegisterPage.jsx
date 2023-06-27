import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper } from '@mui/material';

function RegisterPage ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('');
  const [restaurantName, setRestaurantName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [description, setDescription] = React.useState('');
  const navigate = useNavigate();

  function register () {
    onSuccess(1);
    navigate('/manager/menu')
  }

  return <>
  <div className='login-page'>
  <Paper className='paper' elevation={3}>
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
    <Button onClick={register}>Register</Button>
    </form>
  </Paper>
  </div>
  </>;
}

export default RegisterPage;

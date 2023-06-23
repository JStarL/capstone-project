import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper } from '@mui/material';

function ManagerLoginPage () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  return <>
  <div className='login-page'>
  <Paper className='paper' elevation={3}>
    <form className='login-form'>
      <Typography className='h4' variant="h4" gutterBottom>Login Page</Typography>
      <TextField label='Email'
      id='login-email'
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
    <Button onClick={ () => { navigate('/manager/menu') } }>Log In</Button>
    </form>
  </Paper>
  </div>
  </>;
}

export default ManagerLoginPage;

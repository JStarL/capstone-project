import React from 'react';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Typography, Paper } from '@mui/material';
import makeRequest from '../makeRequest.jsx'

function ManagerLoginPage ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function login () {
    const body = JSON.stringify({
      email,
      password,
    })
    const data = makeRequest('/auth/login', 'POST', body, 1)
    onSuccess(data);
    console.log(data);
    navigate('/manager/menu')
  }

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
    <Button onClick={login}>Log In</Button>
    <br></br>
    <span className="link"><Link to='/register'>New Manager? Sign Up Here!</Link></span>
    </form>
  </Paper>
  </div>
  </>;
}

export default ManagerLoginPage;

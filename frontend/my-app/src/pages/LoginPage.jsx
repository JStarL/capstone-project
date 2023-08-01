import React from 'react';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Typography, Paper } from '@mui/material';
import makeRequest from '../makeRequest.jsx'
import { StyledButton } from './CustomerOrStaff';

function LoginPage({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function login() {
    const body = JSON.stringify({
      email,
      password
    })
    makeRequest('/auth/login', 'POST', body, undefined)
      .then(data => {
        if (data.hasOwnProperty('success')) {
          onSuccess(data['staff_id'], data['staff_type'], data['menu_id'])
          if (data['staff_type'] === 'kitchen') {
            navigate(`/kitchen_staff/${data['menu_id']}/${data['staff_id']}`)
          }
          else if (data['staff_type'] === 'wait') {
            navigate(`/wait_staff/${data['menu_id']}/${data['staff_id']}`)
          }
          else if (data['staff_type'] === 'manager') {
            navigate(`/manager/menu/${data['menu_id']}/${data['staff_id']}`)
          }
        } else {
          alert(data['error'])
        }
      })
      .catch(e => console.log('Error: ' + e))
  }

  return <>
    <div className='login-page'>
      <Paper sx={{ p:4, borderRadius: '20px' }} elevation={5}>
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
          <StyledButton variant="outlined" sx={{ mb: 2, p:1.5, width: "100%" }} onClick={login}>Log In</StyledButton>
          <br></br>
          <span className="link"><Link to='/register' style={{ color: '#002250' }}>New Manager? Sign Up Here!</Link></span>
        </form>
      </Paper>
    </div>
  </>;
}

export default LoginPage;

import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ManagerLoginPage from './pages/ManagerLoginPage'
import AddStaffPage from './pages/AddStaffPage';
import ManagerMenuPage from './pages/ManagerMenuPage';
import NewMenuItemPage from './pages/NewMenuItemPage';
import RegisterPage from './pages/RegisterPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomerOrStaff from './pages/CustomerOrStaff';
import makeRequest from './makeRequest';

function App() {
  const [id, setId] = React.useState(null);
  const [staffType, setStaffType] = React.useState(localStorage.getItem('staff_type'))
  const [menuId, setMenuId] = React.useState(localStorage.getItem('menu_id'))

  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
  }, []);

  const login = (staff_id, staff_type) => {
    setId(staff_id);
    setStaffType(staff_type)
    localStorage.setItem('staff_id', staff_id);
  }

  const logout = () => {
    const body = JSON.stringify({
      'staff_id': id.toString(),
    })
    console.log(body)
    makeRequest('/auth/logout', 'POST', body, undefined)
    .then(data => {
      console.log(data)
    })
    .catch(e => console.log('Error: ' + e))
    setId(null);
    setStaffType(null);
    localStorage.removeItem('staff_id');
    localStorage.removeItem('manager_id');
    localStorage.removeItem('menu_id');
    localStorage.removeItem('staff_type');
    localStorage.clear()
  }

  const LogoutButton = () => {
    return (
      <nav>
        <div className='nav-container'>
          <Button style={{ marginLeft: 'auto', width: '10%' }} className='logout-button' onClick={logout}><Link to='/'>Logout</Link></Button>
        </div>
      </nav>
    )
  }

  const Nav = () => {
    return (
      <nav>
        <div className='nav-container'>
          <div className='links-container'>
            <span className="link"><Link to='/'>Login</Link></span>
            <span className="link"><Link to='/register  '>Register</Link></span>
          </div>
        </div>
      </nav>
    )
  }

  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
  }, []);
  
  return (
    <div className="App">
      <BrowserRouter>
      <header>
        {id === null
          ? <Nav />
          : <LogoutButton className='logout-button' onClick={logout}><Link to='/'>Logout</Link></LogoutButton>
        }
      </header>
      <main>
        <Routes>
          <Route path='/' element={<CustomerOrStaff />} />
          <Route path='/login' element={<ManagerLoginPage onSuccess={login} />} />
          <Route path='/register' element={<RegisterPage onSuccess={login} />} />
          <Route path='/addstaff' element={<AddStaffPage />} />
          <Route path='/manager/menu/:menuId' element={<ManagerMenuPage />} />
          <Route path='/manager/addnewmenuitem/:menuId/:categoryName/:categoryId' element={<NewMenuItemPage />} />

          <Route path='/kitchen_staff' element={<div>Kitchen Staff Logged In</div>} />
          <Route path='/wait_staff' element={<div>Wait Staff Logged In</div>} />

          <Route path='/customer/:menuId' element={<CustomerMenuPage />} />
        </Routes>
      </main>
      <footer>
        {staffType !== 'manager'
          ? null
          : (<div className="footer-container">
            <Button><Link to='/addstaff'>Add Staff</Link></Button>
            <Button><Link to={`/manager/menu/${menuId}`}>Go to Menu</Link></Button>
            </div>)}
      </footer>
        
      </BrowserRouter>
    </div>
  );
}

export default App;

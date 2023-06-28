import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ManagerLoginPage from './pages/ManagerLoginPage'
import LogoutButton from './components/LogoutButton';
import AddStaffPage from './pages/AddStaffPage';
import ManagerMenuPage from './pages/ManagerMenuPage';
import NewMenuItemPage from './pages/NewMenuItemPage';
import RegisterPage from './pages/RegisterPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import CustomerOrStaff from './pages/CustomerOrStaff';

function App() {
  const [id, setId] = React.useState(null);

  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
  }, []);

  const login = (staff_id) => {
    setId(staff_id);
    localStorage.setItem('staff_id', staff_id);
  }

  const logout = () => {
    console.log('logout')
    setId(null);
    localStorage.removeItem('staff_id');
    localStorage.removeItem('manager_id');
    localStorage.removeItem('menu_id');
    localStorage.removeItem('staff_type');
    localStorage.clear()
  }

  const Nav2 = () => {
    return (
      <nav>
        <div className="nav-container">
          <div className="links-container">
            <span className="link"><Link to='/'>Manager Login</Link></span>
            <span className="link"><Link to='/addstaff  '>Add Staff</Link></span>
            <span className="link"><Link to='/category'>Category</Link></span>
            <span className="link"><Link to='/manager/menu'>Menu</Link></span>
            <span className="link"><Link to='/manager/addnewmenuitem'>New Menu Item</Link></span>
          </div>
        </div>
        <Button className='logout-button' onClick={logout}><Link to='/'>Logout</Link></Button>
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
        {['/', '/login', '/register', '/addstaff', '/manager/menu', '/manager/addnewmenuitem', '/manager/setup'].includes(window.location.pathname)
          ? (id === null
              ? <Nav />
              : <Nav2 />
            )
          : null
        }
      </header>
      <main>
        <Routes>
          <Route path='/' element={<CustomerOrStaff />} />
          <Route path='/login' element={<ManagerLoginPage onSuccess={login} />} />
          <Route path='/register' element={<RegisterPage onSuccess={login} />} />
          <Route path='/addstaff' element={<AddStaffPage />} />
          <Route path='/manager/menu' element={<ManagerMenuPage />} />
          <Route path='/manager/addnewmenuitem' element={<NewMenuItemPage />} />

          <Route path='/customer/:menuId' element={<CustomerMenuPage />} />
        </Routes>
      </main>
      <footer>
        {id === null
          ? null
          : (<div className="footer-container">
            <Button><Link to='/addstaff'>Add Staff</Link></Button>
            <Button><Link to='/manager/menu'>Menu</Link></Button>
            </div>)}
      </footer>
        
      </BrowserRouter>
    </div>
  );
}

export default App;

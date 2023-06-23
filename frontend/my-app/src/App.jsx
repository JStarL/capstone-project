import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ManagerLoginPage from './pages/ManagerLoginPage'
import LogoutButton from './components/LogoutButton';
import AddStaffPage from './pages/AddStaffPage';
import ManagerMenuPage from './pages/ManagerMenuPage';
import NewMenuItemPage from './pages/NewMenuItemPage';

function App() {
  const Nav = () => {
    return (
      <nav>
        <div className="nav-container">
          <div className="links-container">
            <span className="link"><Link to='/login'>Manager Login</Link></span>
            <span className="link"><Link to='/addstaff  '>Add Staff</Link></span>
            <span className="link"><Link to='/category'>Category</Link></span>
            <span className="link"><Link to='/manager/menu'>Menu</Link></span>
            <span className="link"><Link to='/manager/addnewmenuitem'>New Menu Item</Link></span>
          </div>
        </div>
        <LogoutButton className='logout-button'>Logout</LogoutButton>
      </nav>
    )
  }

  const Dashboard = () => {
    return (
      <div className="dashboard">
        Main Screen
      </div>
    )
  }
  
  return (
    <div className="App">
      <BrowserRouter>
      <header>
        <Nav />
      </header>
        <main>
          <Routes>
            <Route path='/' element={<Dashboard />}/>
            <Route path='/login' element={<ManagerLoginPage />}/>
            <Route path='/addstaff' element={<AddStaffPage />}/>
            <Route path='/manager/menu' element={<ManagerMenuPage />}/>
            <Route path='/manager/addnewmenuitem' element={<NewMenuItemPage />}/>
          </Routes>
        </main>
        <footer>
          <div className="footer-container">
            <Button><Link to='/addstaff'>Add Staff</Link></Button>
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;

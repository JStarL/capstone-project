import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import PersonAddAlt1SharpIcon from '@mui/icons-material/PersonAddAlt1Sharp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import ManagerLoginPage from './pages/ManagerLoginPage'
import AddStaffPage from './pages/AddStaffPage';
import ManagerMenuPage from './pages/ManagerMenuPage';
import NewMenuItemPage from './pages/NewMenuItemPage';
import RegisterPage from './pages/RegisterPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomerOrStaff from './pages/CustomerOrStaff';
import FoodItemPage from './pages/FoodItemPage';
import makeRequest from './makeRequest';
import { StyledButton } from './pages/CustomerOrStaff';
import SelectTableNumber from './pages/SelectTableNumber';
import SearchRestaurant from './pages/SearchRestaurant';
import CustomerViewOrderPage from './pages/CustomerViewOrderPage';
import PersonalisePage from './pages/PersonalisePage';

function App() {
  const [id, setId] = React.useState(null);
  const [staffType, setStaffType] = React.useState(localStorage.getItem('staffType'))
  const [menuId, setMenuId] = React.useState(localStorage.getItem('menu_id'))
  const [sessionId, setSessionId] = React.useState(localStorage.getItem('session_id'))
  const [tableNumber, setTableNumber] = React.useState(localStorage.getItem('table_number'))

  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
    if (localStorage.getItem('staff_type')) {
      setStaffType(localStorage.getItem('staff_type'));
      console.log(staffType)
    }
    if (localStorage.getItem('menu_id')) {
      setStaffType(localStorage.getItem('menu_id'));
    }
  }, []);

  console.log(localStorage.getItem('staff_type'))

  // React.useEffect(function () {
  //   console.log('staff type change')
  //   setStaffType(localStorage.getItem('staff_type'))
  // }, [localStorage.getItem('staff_type')]);

  const customer = (staff_type, session_id) => {
    setStaffType(staff_type)
    setSessionId(session_id)
  }

  const reset = (staff_type, session_id, menu_id, table_number) => {
    setStaffType(staff_type)
    setSessionId(session_id)
    setMenuId(menu_id)
    setTableNumber(table_number)
  }
  const restaurantSuccess = (menu_id) => {
    console.log(menu_id)
    setMenuId(menu_id)
  }
  const tableNumberSuccess = (table_number) => {
    setTableNumber(table_number)
  }
  const login = (staff_id, staff_type, menu_id) => {
    setId(staff_id);
    setStaffType(staff_type);
    setMenuId(menu_id)
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
      <nav sx={{ display: 'flex' }}>
        <div className='nav-container'>
          <StyledButton sx={{
            margin: '5px',
            marginLeft: 'auto',
            width: '7%',
            height: '70%',
          }} onClick={logout} startIcon={<LogoutIcon />}>
            <a className='toNavy' href='/'>
              Logout
            </a>
          </StyledButton>
        </div>
      </nav>
    )
  }

  const Nav = () => {
    return (
      <nav>
        <div className='nav-container' sx={{ zIndex: 100 }}>
          <div className='links-container'>
            <span className="link"><Link to='/'>Login</Link></span>
            <span className="link"><Link to='/register  '>Register</Link></span>
          </div>
        </div>
      </nav>
    )
  }

  const Footer = () => {
    if (staffType === 'manager') {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<PersonAddAlt1SharpIcon />}>
            <Link to="/addstaff" className="toNavy">Add Staff</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/manager/menu/${menuId}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
        </div>
      );
    } else if (staffType === 'customer' && menuId !== null && tableNumber !== null) {
      console.log(menuId);
      console.log(tableNumber);
      return (
        <div className="footer-container">
          <StyledButton startIcon={<ShoppingCartIcon />}>
            <Link to={`/customer/${sessionId}/view_order/${menuId}/${tableNumber}`} className="toNavy">View Cart</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/customer/${sessionId}/${menuId}/${tableNumber}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
          <StyledButton startIcon={<SettingsIcon />}>
            <Link to={`/customer/${sessionId}/${menuId}/personalise`} className="toNavy">Personalise</Link>
          </StyledButton>
        </div>
      );
    } else {
      return null; // Render nothing if menuId or tableNumber is missing
    }
  };



  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
  }, []);

  console.log(staffType)
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          {id === null
            ? <Nav />
            : <LogoutButton className='logout-button' onClick={logout}></LogoutButton>
          }
        </header>
        <main>
          <Routes>
            <Route path='/' element={<CustomerOrStaff onSuccess={customer} reset={reset}/>} />
            <Route path='/login' element={<ManagerLoginPage onSuccess={login} />} />
            <Route path='/register' element={<RegisterPage onSuccess={login} />} />
            {/* <Route path='/searchrestaurant' element={<SearchRestaurant />} />
            <Route path='/tablenumber' element={<SelectTableNumber />} /> */}
            <Route path='/addstaff' element={<AddStaffPage />} />
            <Route path='/manager/menu/:menuId' element={<ManagerMenuPage />} />
            <Route path='/manager/addnewmenuitem/:menuId/:categoryName/:categoryId' element={<NewMenuItemPage />} />

            <Route path='/kitchen_staff' element={<div>Kitchen Staff Logged In</div>} />
            <Route path='/wait_staff' element={<div>Wait Staff Logged In</div>} />

            <Route path='/customer/:sessionId/searchrestaurant' element={<SearchRestaurant onSuccess={restaurantSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/tablenumber' element={<SelectTableNumber onSuccess={tableNumberSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/:tableNumber' element={<CustomerMenuPage />} />
            <Route path='/customer/:sessionId/:menuId/:categoryId/:foodId' element={<FoodItemPage />} />
            <Route path='/customer/:sessionId/:menuId/personalise' element={<PersonalisePage />} />
            <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber' element={<CustomerViewOrderPage />} />
          </Routes>
        </main>
        <footer>
          <Footer />
          {/* {localStorage.getItem('staff_type') !== 'manager'
            ? null
            : (<div className="footer-container">
              <StyledButton startIcon={<PersonAddAlt1SharpIcon />}><Link to='/addstaff' className='toNavy'>Add Staff</Link></StyledButton>
              <StyledButton startIcon={<RestaurantMenuIcon />}><Link to={`/manager/menu/${menuId}`} className='toNavy'>Go to Menu</Link></StyledButton>
            </div>)} */}
        </footer>

      </BrowserRouter>
    </div>
  );
}

export default App;

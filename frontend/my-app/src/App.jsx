import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
import { Typography } from '@mui/material';
import WaitStaffPage from './pages/WaitStaffPage';


function App() {
  const [id, setId] = React.useState(null);
  const [staffType, setStaffType] = React.useState(localStorage.getItem('staffType'))
  const [menuId, setMenuId] = React.useState(localStorage.getItem('menu_id'))
  const [sessionId, setSessionId] = React.useState(localStorage.getItem('session_id'))
  const [tableNumber, setTableNumber] = React.useState(localStorage.getItem('table_number'))
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState(0);
  const [currentlySelectedPersonaAllergies, setCurrentlySelectedPersonaAllergies] = React.useState([]);

  const [personas, setPersonas] = React.useState([['Default', [null]]])
  React.useEffect(function () {
    if (localStorage.getItem('staff_id')) {
      setId(localStorage.getItem('staff_id'));
    }
    if (localStorage.getItem('staff_type')) {
      setStaffType(localStorage.getItem('staff_type'));
    }
    if (localStorage.getItem('menu_id')) {
      setStaffType(localStorage.getItem('menu_id'));
    }
  }, []);

  const handlePersonas = (name, allergies) => {
    const persona = [name, allergies];
    const updatedPersonas = [...personas];
    
    const existingPersonaIndex = updatedPersonas.findIndex((p) => p[0] === name);
    if (existingPersonaIndex !== -1) {
      updatedPersonas[existingPersonaIndex] = persona;
    } else {
      updatedPersonas.push(persona);
    }
      setPersonas(updatedPersonas);
  };
  
  const customer = (staff_type, session_id) => {
    setStaffType(staff_type)
    setSessionId(session_id)
  }

  const reset = (staff_type, session_id, menu_id, table_number) => {
    setStaffType(staff_type)
    setSessionId(session_id)
    setMenuId(menu_id)
    setTableNumber(table_number)
    setPersonas([['Default', [null]]])
    setCurrentlySelectedPersona(0)
    setCurrentlySelectedPersonaAllergies([])
  }
  const restaurantSuccess = (menu_id) => {
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
        <div className='nav-container' sx={{ zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='links-container'>
            <span className="link"><Link to='/'>Login</Link></span>
            <span className="link"><Link to='/register'>Register</Link></span>
          </div>
          {tableNumber ? (<div className='links-container' style={{ marginLeft: 'auto', marginTop: '5px' }}>
            <Typography style={{ color: 'white' }} variant="overline" gutterBottom>Table Number: {tableNumber}</Typography>
            </div>)
          : null}
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
      return (
        <div className="footer-container">
          <StyledButton startIcon={<ShoppingCartIcon />}>
            <Link to={`/customer/${sessionId}/view_order/${menuId}/${tableNumber}`} className="toNavy">View Cart</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/customer/${sessionId}/${menuId}/${tableNumber}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
          <StyledButton startIcon={<SettingsIcon />}>
            <Link to={`/customer/${sessionId}/${menuId}/${tableNumber}/personalise`} className="toNavy">Personalise</Link>
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
            <Route path='/wait_staff/:waitStaffId/orderList' element={<WaitStaffPage/>} />

            <Route path='/customer/:sessionId/searchrestaurant' element={<SearchRestaurant onSuccess={restaurantSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/tablenumber' element={<SelectTableNumber onSuccess={tableNumberSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/:tableNumber' element={<CustomerMenuPage personas={personas} currentlySelectedPersona={currentlySelectedPersona} setCurrentlySelectedPersona={setCurrentlySelectedPersona} currentlySelectedPersonaAllergies={currentlySelectedPersonaAllergies} setCurrentlySelectedPersonaAllergies={setCurrentlySelectedPersonaAllergies} />} />
            <Route path='/customer/:sessionId/:menuId/:categoryId/:foodId' element={<FoodItemPage />} />
            <Route path='/customer/:sessionId/:menuId/:tableNumber/personalise' element={<PersonalisePage personas={personas} handlePersonas={handlePersonas} setCurrentlySelectedPersonaApp={setCurrentlySelectedPersona} setCurrentlySelectedPersonaAllergies={setCurrentlySelectedPersonaAllergies}/>} />
            <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber' element={<CustomerViewOrderPage />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>

      </BrowserRouter>
    </div>
  );
}

export default App;

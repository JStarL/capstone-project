import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import WaitStaffPage from './pages/WaitStaffPage';
import KitchenStaffPage from './pages/KitchenStaffPage';
import makeRequest from './makeRequest';
import { StyledButton } from './pages/CustomerOrStaff';
import SelectTableNumber from './pages/SelectTableNumber';
import SearchRestaurant from './pages/SearchRestaurant';
import CustomerViewOrderPage from './pages/CustomerViewOrderPage';
import CustomerPayPage from './pages/CustomerPayPage';
import PersonalisePage from './pages/PersonalisePage';
import { Typography } from '@mui/material';
import BackHandIcon from '@mui/icons-material/BackHand';

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

  const [isCustomer, setIsCustomer] = React.useState(false);
  const [isManager, setIsManager] = React.useState(false);
  const [isStaff, setIsStaff] = React.useState(false);
  const [isKitchen, setIsKitchen] = React.useState(false);
  const [isWait, setIsWait] = React.useState(false);


  const location = useLocation();

  React.useEffect(() => {
    const pathname = location.pathname;
    const hasCustomerPath = /^\/customer\/\d+\/\d+\/\d+$/.test(pathname);
    const isPersonalisePage = /^\/customer\/\d+\/\d+\/\d+\/personalise$/.test(pathname);
    const isViewOrderPage = /^\/customer\/\d+\/view_order\/\d+\/\d+$/.test(pathname);

    setIsCustomer(hasCustomerPath || isPersonalisePage || isViewOrderPage);
  }, [location]);

  React.useEffect(() => {
    const pathname = location.pathname;
    const hasManagerPath = pathname.includes('/manager/');
    setIsManager(hasManagerPath);
    // setIsStaff(hasManagerPath)
  }, [location]);

  React.useEffect(() => {
    const pathname = location.pathname;
    const hasStaffPath = pathname.includes('/manager/') || pathname.includes('kitchen_staff')  || pathname.includes('wait_staff');
    const hasKitchenStaff = pathname.includes('kitchen_staff')  
    const hasWaitStaff = pathname.includes('wait_staff');
    setIsStaff(hasStaffPath)
    setIsKitchen(hasKitchenStaff)
    setIsWait(hasWaitStaff)
  }, [location]);


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

  const requestAssistance = () => {
    const body = JSON.stringify({
      table_id: tableNumber,
      session_id: sessionId,
      menu_id: menuId,
    });
    makeRequest('/customer/request_assistance', 'POST', body, undefined)
      .then(data => {
        console.log(data);
      })
      .catch(e => console.log('Error: ' + e));
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
        <div className='links-container' style={{ marginRight: 'auto', marginTop: '5px', marginLeft: '20px' }}>
          <Typography style={{ color: 'white' }} variant="overline" gutterBottom>{isManager ? 'Manager' : isKitchen ? 'Kitchen Staff' : 'Wait Staff'}</Typography>
        </div>
        <div className='nav-container'>
          <StyledButton sx={{
            margin: '5px',
            marginLeft: 'auto',
            width: '70%',
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
        <div className='customer-nav-container' sx={{ zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='links-container'>
            <span className="link"><Link to='/'>Home</Link></span>
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
    if (isManager) {
      return (
        <div className="footer-container">
          <StyledButton startIcon={<PersonAddAlt1SharpIcon />}>
            <Link to={`/manager/addstaff/${menuId}/${id}`} className="toNavy">Add Staff</Link>
          </StyledButton>
          <StyledButton startIcon={<RestaurantMenuIcon />}>
            <Link to={`/manager/menu/${menuId}`} className="toNavy">Go to Menu</Link>
          </StyledButton>
        </div>
      );
    } else if (isCustomer) {
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
          <StyledButton onClick={requestAssistance} startIcon={<BackHandIcon />} className="toNavy" >
            Request Assistance
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
      {/* <BrowserRouter> */}
        <header>
          {!isStaff
            ? <Nav />
            : <LogoutButton className='logout-button' onClick={logout}></LogoutButton>
          }
        </header>
        <main>
          <Routes>
            <Route path='/' element={<CustomerOrStaff onSuccess={customer} reset={reset}/>} />
            <Route path='/login' element={<ManagerLoginPage onSuccess={login} />} />
            <Route path='/register' element={<RegisterPage onSuccess={login} />} />
            <Route path='/manager/addstaff/:menuId/:managerId' element={<AddStaffPage />} />
            <Route path='/manager/menu/:menuId' element={<ManagerMenuPage />} />
            <Route path='/manager/addnewmenuitem/:menuId/:categoryName/:categoryId' element={<NewMenuItemPage />} />

            <Route path='/kitchen_staff/:menuId/:staffId' element={<KitchenStaffPage />} />
            <Route path='/wait_staff/:menuId/:staffId' element={<WaitStaffPage />} />

            <Route path='/customer/:sessionId/searchrestaurant' element={<SearchRestaurant onSuccess={restaurantSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/tablenumber' element={<SelectTableNumber onSuccess={tableNumberSuccess} />} />
            <Route path='/customer/:sessionId/:menuId/:tableNumber' element={<CustomerMenuPage personas={personas} currentlySelectedPersona={currentlySelectedPersona} setCurrentlySelectedPersona={setCurrentlySelectedPersona} currentlySelectedPersonaAllergies={currentlySelectedPersonaAllergies} setCurrentlySelectedPersonaAllergies={setCurrentlySelectedPersonaAllergies} />} />
            <Route path='/customer/:sessionId/:menuId/:categoryId/:foodId' element={<FoodItemPage currentlySelectedPersona={currentlySelectedPersona}/>} />
            <Route path='/customer/:sessionId/:menuId/:tableNumber/personalise' element={<PersonalisePage personas={personas} handlePersonas={handlePersonas} setCurrentlySelectedPersonaApp={setCurrentlySelectedPersona} setCurrentlySelectedPersonaAllergies={setCurrentlySelectedPersonaAllergies}/>} />
            <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber' element={<CustomerViewOrderPage personas={personas}/>} />
            <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber/pay' element={<CustomerPayPage personas={personas}/>} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>

      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;

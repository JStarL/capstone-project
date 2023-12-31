import './App.css';
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddStaffPage from './pages/AddStaffPage';
import ManagerMenuPage from './pages/ManagerMenuPage';
import NewMenuItemPage from './pages/NewMenuItemPage';
import RegisterPage from './pages/RegisterPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import CustomerOrStaff from './pages/CustomerOrStaff';
import FoodItemPage from './pages/FoodItemPage';
import WaitStaffPage from './pages/WaitStaffPage';
import KitchenStaffPage from './pages/KitchenStaffPage';
import SelectTableNumber from './pages/SelectTableNumber';
import SearchRestaurant from './pages/SearchRestaurant';
import CustomerViewOrderPage from './pages/CustomerViewOrderPage';
import CustomerPayPage from './pages/CustomerPayPage';
import CustomerRatePage from './pages/CustomerRatePage';
import PersonalisePage from './pages/PersonalisePage';
import Footer from './components/Footer';
import Nav from './components/Nav';

/**
 * Represents the main App component that handles routing and user authentication.
 * @returns {JSX.Element} The JSX representation of the App component.
 */
function App() {
  // State variables to manage various data throughout the application
  const [id, setId] = React.useState(null);
  const [staffType, setStaffType] = React.useState('');
  const [menuId, setMenuId] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [tableNumber, setTableNumber] = React.useState('');
  const [currentlySelectedPersona, setCurrentlySelectedPersona] = React.useState(0);
  const [currentlySelectedPersonaAllergies, setCurrentlySelectedPersonaAllergies] = React.useState([]);
  const [excludeCategories, setExcludeCategories] = React.useState([]);
  const [personas, setPersonas] = React.useState([['Default', [null], []]]);
  const [isCustomer, setIsCustomer] = React.useState(false);
  const [isManager, setIsManager] = React.useState(false);
  const [isStaff, setIsStaff] = React.useState(false);
  const [isKitchen, setIsKitchen] = React.useState(false);
  const [isWait, setIsWait] = React.useState(false);

  const location = useLocation();

  // Check if the current path belongs to a customer
  React.useEffect(() => {
    const pathname = location.pathname;
    const hasCustomerPath = /^\/customer\/\d+\/\d+\/\d+$/.test(pathname);
    const isPersonalisePage = /^\/customer\/\d+\/\d+\/\d+\/personalise$/.test(pathname);
    const isViewOrderPage = /^\/customer\/\d+\/view_order\/\d+\/\d+$/.test(pathname);
    const isFoodItemPage = /^\/customer\/\d+\/\d+\/\d+\/\d+\/\w+$/.test(pathname);

    setIsCustomer(hasCustomerPath || isPersonalisePage || isViewOrderPage || isFoodItemPage);
  }, [location]);

  // Check if the current path belongs to a manager
  React.useEffect(() => {
    const pathname = location.pathname;
    const hasManagerPath = pathname.includes('/manager/');
    setIsManager(hasManagerPath);
  }, [location]);

  // Check if the current path belongs to staff (kitchen or wait staff)
  React.useEffect(() => {
    const pathname = location.pathname;
    const hasStaffPath = pathname.includes('/manager/') || pathname.includes('kitchen_staff') || pathname.includes('wait_staff');
    const hasKitchenStaff = pathname.includes('kitchen_staff');
    const hasWaitStaff = pathname.includes('wait_staff');
    setIsStaff(hasStaffPath);
    setIsKitchen(hasKitchenStaff);
    setIsWait(hasWaitStaff);
  }, [location]);

  // Function to handle persona data
  const handlePersonas = (name, allergies) => {
    const category = [];
    const persona = [name, allergies, category];
    const updatedPersonas = [...personas];

    const existingPersonaIndex = updatedPersonas.findIndex((p) => p[0] === name);
    if (existingPersonaIndex !== -1) {
      updatedPersonas[existingPersonaIndex] = persona;
    } else {
      updatedPersonas.push(persona);
    }
    setPersonas(updatedPersonas);
  };

  // Function to handle excluded categories for a persona
  const handleExcludeCategories = (name, category, addExclude) => {
    const updatedPersonas = [...personas];

    const existingPersonaIndex = updatedPersonas.findIndex((p) => p[0] === name);
    if (existingPersonaIndex !== -1) {
      let existingCategories;
      let persona = [name, currentlySelectedPersonaAllergies];
      if (addExclude) {
        existingCategories = [...updatedPersonas[existingPersonaIndex][2], category];
        if (existingCategories[0] === null) {
          existingCategories.splice(0, 1);
        }
      } else {
        const indexOfCategory = updatedPersonas[existingPersonaIndex][2].indexOf(category);
        if (indexOfCategory !== -1) {
          updatedPersonas[existingPersonaIndex][2].splice(indexOfCategory, 1);
        }
        existingCategories = updatedPersonas[existingPersonaIndex][2];
      }
      persona.push(existingCategories);
      setExcludeCategories(existingCategories);
      updatedPersonas[existingPersonaIndex] = persona;
    }
    setPersonas(updatedPersonas);
  };

  // Function to handle the currently selected persona and its allergies
  const handleCurrentlySelectedPersona = (personaName, allergies) => {
    let personaExists = false;
    setCurrentlySelectedPersonaAllergies(allergies);
    personas?.map((persona, index) => {
      if (persona[0] === personaName) {
        setCurrentlySelectedPersona(index);
        setExcludeCategories(persona[2]);
        personaExists = true;
      }
    });
    if (!personaExists) {
      setCurrentlySelectedPersona(personas.length);
      setExcludeCategories([]);
    }
  };

  // Function to handle customer authentication
  const customer = (staff_type, session_id) => {
    setStaffType(staff_type);
    setSessionId(session_id);
  };

  // Function to reset various data for a new customer session
  const reset = (staff_type, session_id, menu_id, table_number) => {
    setStaffType(staff_type);
    setSessionId(session_id);
    setMenuId(menu_id);
    setTableNumber(table_number);
    setPersonas([['Default', [null], [null]]]);
    setCurrentlySelectedPersona(0);
    setCurrentlySelectedPersonaAllergies([]);
    setExcludeCategories([]);
  };

  // Function to handle restaurant selection success
  const restaurantSuccess = (menu_id) => {
    setMenuId(menu_id);
  };

  // Function to handle table number selection success
  const tableNumberSuccess = (table_number) => {
    setTableNumber(table_number);
  };

  // Function to handle staff login success
  const login = (staff_id, staff_type, menu_id) => {
    setId(staff_id);
    setStaffType(staff_type);
    setMenuId(menu_id);
  };

  return (
    <div className="App">
      <header>
        {/* Header */}
        <Nav id={id} setId={setId} setStaffType={setStaffType} setIsCustomer={setIsCustomer} setIsStaff={setIsStaff} isManager={isManager} isKitchen={isKitchen} tableNumber={tableNumber} personas={personas} currentlySelectedPersona={currentlySelectedPersona} isStaff={isStaff} />
      </header>
      <main>
        <Routes>
          {/* Homepage */}
          <Route path='/' element={<CustomerOrStaff onSuccess={customer} reset={reset} />} />

          {/* Authentication Routes */}
          <Route path='/login' element={<LoginPage onSuccess={login} />} />
          <Route path='/register' element={<RegisterPage onSuccess={login} />} />

          {/* Manager Routes */}
          <Route path='/manager/addstaff/:menuId/:managerId' element={<AddStaffPage setId={setId} setMenuId={setMenuId} />} />
          <Route path='/manager/menu/:menuId/:managerId' element={<ManagerMenuPage />} />
          <Route path='/manager/addnewmenuitem/:menuId/:managerId/:categoryName/:categoryId' element={<NewMenuItemPage />} />

          {/* Staff Routes */}
          <Route path='/kitchen_staff/:menuId/:staffId' element={<KitchenStaffPage />} />
          <Route path='/wait_staff/:menuId/:staffId' element={<WaitStaffPage />} />

          {/* Customer Routes */}
          <Route path='/customer/:sessionId/searchrestaurant' element={<SearchRestaurant onSuccess={restaurantSuccess} />} />
          <Route path='/customer/:sessionId/:menuId/tablenumber' element={<SelectTableNumber onSuccess={tableNumberSuccess} />} />
          <Route path='/customer/:sessionId/:menuId/:tableNumber' element={<CustomerMenuPage handleExcludeCategories={handleExcludeCategories} personas={personas} excludeCategories={excludeCategories} setExcludeCategories={setExcludeCategories} currentlySelectedPersona={currentlySelectedPersona} setCurrentlySelectedPersona={setCurrentlySelectedPersona} currentlySelectedPersonaAllergies={currentlySelectedPersonaAllergies} setCurrentlySelectedPersonaAllergies={setCurrentlySelectedPersonaAllergies} setMenuId={setMenuId} setTableNumber={setTableNumber} setSessionId={setSessionId} />} />
          <Route path='/customer/:sessionId/:menuId/:categoryId/:tableNumber/:foodId' element={<FoodItemPage currentlySelectedPersona={currentlySelectedPersona} />} />
          <Route path='/customer/:sessionId/:menuId/:tableNumber/personalise' element={<PersonalisePage personas={personas} handlePersonas={handlePersonas} handleCurrentlySelectedPersona={handleCurrentlySelectedPersona} />} />
          <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber' element={<CustomerViewOrderPage personas={personas} currentlySelectedPersona={currentlySelectedPersona} handleExcludeCategories={handleExcludeCategories} />} />
          <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber/pay' element={<CustomerPayPage personas={personas} />} />
          <Route path='/customer/:sessionId/view_order/:menuId/:tableNumber/rate' element={<CustomerRatePage personas={personas} />} />
        </Routes>
      </main>
      <footer>
        {/* Footer */}
        <Footer tableNumber={tableNumber} sessionId={sessionId} menuId={menuId} id={id} isManager={isManager} isCustomer={isCustomer} />
      </footer>
    </div>
  );
}

export default App;

import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [gamesWon, setGamesWon] = React.useState(0)

  const resetGamesWon = () => {
    setGamesWon(0);
  }
  const Nav = () => {
    return (
      <nav>
        <div className="nav-container">
          <div className="links-container">
            <span className="link"><Link to='/login'>Manager Login</Link></span>
            <span className="link"><Link to='/addstaff  '>Add Staff</Link></span>
            <span className="link"><Link to='/category'>Category</Link></span>
            <span className="link"><Link to='/menu'>Menu</Link></span>
          </div>
        </div>
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
          </Routes>
        </main>
        <footer>
          <div className="footer-container">
            {/* Footer content */}
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;

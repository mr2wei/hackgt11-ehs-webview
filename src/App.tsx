import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Home from './pages/home';
import PatientPage from './pages/patient';
import Login from './pages/login';
import { checkLogin } from './utils/api';
import './App.css';

function App() {
  const [isPrivileged, setIsPrivileged] = useState(false); // Will be updated by login route when implemented

  useEffect(() => {
    setIsPrivileged(true); // Remove this line when login route is implemented
    
    if (window.location.pathname !== '/login') {
      checkLogin();
    }
  }, []);



  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home isPrivileged={isPrivileged} />} />
          <Route path="/patient/:patientId" element={<PatientPage />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;

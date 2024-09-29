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
  const [isPrivileged, _setIsPrivileged] = useState(false); 

  const setIsPrivileged = (value: any) => {
    console.log('setIsPrivileged called with:', value);
    // Optionally, log the call stack to see from where it was called
    console.trace('setIsPrivileged call stack');
    _setIsPrivileged(value);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (window.location.pathname !== '/login') {
        const checkRes = await checkLogin();
        if (checkRes.is_logged_in) {
          if (checkRes.is_doctor) {
            setIsPrivileged(true);
          } else {
            setIsPrivileged(false);
          }
        } else {
          window.location.href = '/login';
        }
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log(isPrivileged);
  }, [isPrivileged]);


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsPrivileged={setIsPrivileged} />} />
          <Route path="/home" element={<Home isPrivileged={isPrivileged} />} />
          <Route path="/patient/:patientId" element={<PatientPage isPrivileged={isPrivileged} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

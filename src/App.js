import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Family from './pages/Family';
import GoalsHabits from './pages/GoalsHabits';
import CustomPlanner from './pages/CustomPlanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/Register';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Application Routes */}
        <Route path='/' element={<SignIn />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/planner' element={<Planner />} />
        <Route path='/family' element={<Family />} />
        <Route path='/register' element={<Register />} />
        <Route path='/goalshabits' element={<GoalsHabits />} />
        <Route path='/customplanner' element={<CustomPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
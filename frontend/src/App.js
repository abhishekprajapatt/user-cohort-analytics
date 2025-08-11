import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Cohorts from './pages/Cohorts';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cohorts" element={<Cohorts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

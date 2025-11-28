import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/navigation/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Map from './components/map/Map';
import History from './pages/History';
import './styles/App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Map /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={user ? <History /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Location Alarm</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/" className="navbar-item">Home</Link>
                <Link to="/ringtone" className="navbar-item">Ringtone</Link>
                <Link to="/history" className="navbar-item">History</Link>
                <button onClick={handleLogout} className="navbar-item logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
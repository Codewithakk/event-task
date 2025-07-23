import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Events
                </Link>

                <div className="navbar-items">
                    {user ? (
                        <>
                            <span className="navbar-greeting">Hello, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="navbar-button navbar-button-logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-button navbar-button-login">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="navbar-button navbar-button-register"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

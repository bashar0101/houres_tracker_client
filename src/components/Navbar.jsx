import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" className="nav-brand">HoursTracker</Link>
      </h1>
      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            {user && user.role === 'manager' && (
                <li>
                    <Link to="/manager" className="nav-link" style={{color: 'var(--accent-color)'}}>Manager Dashboard</Link>
                </li>
            )}
            <li>
                <button onClick={onLogout} className="nav-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li>
              <Link to="/login" className="nav-btn">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

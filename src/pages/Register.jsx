import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const success = await register(username, password); // No role passed
    if (success) {
        navigate('/');
    } else {
        alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start tracking your work hours</p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
            />
          </div>
          <input type="submit" value="Create Account" className="auth-submit-btn" />
        </form>
        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            <small>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Register;

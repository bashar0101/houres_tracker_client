import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
        navigate('/');
    } else {
        alert(result.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue tracking</p>
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
          <input type="submit" value="Sign In" className="auth-submit-btn" />
        </form>
        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            <small>Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Login;

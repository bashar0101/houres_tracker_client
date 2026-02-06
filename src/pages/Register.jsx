import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: 'create', // 'create' or 'join'
    companyName: '',
    companyId: ''
  });
  const [companies, setCompanies] = useState([]);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password, type, companyName, companyId } = formData;

  useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/companies');
            setCompanies(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, companyId: res.data[0]._id }));
            }
        } catch (err) {
            console.error(err);
        }
    };
    if (type === 'join') {
        fetchCompanies();
    }
  }, [type]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const success = await register(username, password, type, companyName, companyId);
    if (success) {
        if (type === 'join') {
            alert('Registration successful! Please wait for approval.');
            navigate('/login');
        } else {
            navigate('/');
        }
    } else {
        alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join a workspace or start your own</p>
        
        <div style={{display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)'}}>
            <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'create'})}
                style={{
                    flex: 1, 
                    padding: '10px', 
                    background: type === 'create' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    color: type === 'create' ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderBottom: type === 'create' ? '2px solid var(--primary-color)' : 'none'
                }}
            >
                Start Company
            </button>
            <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'join'})}
                 style={{
                    flex: 1, 
                    padding: '10px', 
                    background: type === 'join' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    color: type === 'join' ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderBottom: type === 'join' ? '2px solid var(--primary-color)' : 'none'
                }}
            >
                Join Company
            </button>
        </div>

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

          {type === 'create' ? (
              <div className="form-group">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Company Name"
                  name="companyName"
                  value={companyName}
                  onChange={onChange}
                  required
                />
              </div>
          ) : (
              <div className="form-group">
                 <label style={{color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textAlign: 'left'}}>Select Company</label>
                 <select 
                    name="companyId" 
                    value={companyId} 
                    onChange={onChange}
                    className="auth-input"
                    style={{cursor: 'pointer'}}
                 >
                     {companies.map(c => (
                         <option key={c._id} value={c._id} style={{background: '#333'}}>{c.name}</option>
                     ))}
                 </select>
              </div>
          )}

          <input type="submit" value={type === 'create' ? 'Start & Become Manager' : 'Request to Join'} className="auth-submit-btn" />
        </form>
        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            <small>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Register;

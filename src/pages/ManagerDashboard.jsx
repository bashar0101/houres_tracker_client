import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('work'); // 'work' or 'users'

  useEffect(() => {
    if (!loading) {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user && user.role !== 'manager') {
            navigate('/');
        }
    }
  }, [isAuthenticated, loading, navigate, user]);

  const fetchAllWork = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/manager/all-work');
        setSessions(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const fetchUsers = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/manager/users');
          setUsers(res.data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'manager') {
        fetchAllWork();
        fetchUsers();
    }
  }, [isAuthenticated, user]);

  const toggleRole = async (userId, currentRole) => {
      const newRole = currentRole === 'manager' ? 'user' : 'manager';
      if (userId === user.id) {
          alert("You cannot demote yourself!");
          return;
      }
      try {
          await axios.put(`http://localhost:5000/api/manager/users/${userId}/role`, { role: newRole });
          fetchUsers(); // Refresh list
      } catch (err) {
          console.error(err);
          alert('Failed to update role');
      }
  };

  const formatTime = (ms) => {
    if (!ms) return '-';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h1 className="welcome-text">Manager <span className="accent-text">Dashboard</span></h1>
        
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button 
                onClick={() => setView('work')}
                className={`nav-btn ${view === 'work' ? 'active' : ''}`}
                style={view === 'work' ? {background: 'var(--primary-color)', color: 'white'} : {}}
            >
                Work History
            </button>
            <button 
                onClick={() => setView('users')}
                className={`nav-btn ${view === 'users' ? 'active' : ''}`}
                style={view === 'users' ? {background: 'var(--primary-color)', color: 'white'} : {}}
            >
                Manage Users
            </button>
        </div>
      </div>

      <div className="history-section" style={{marginTop: '2rem'}}>
        {view === 'work' ? (
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length > 0 ? sessions.map(item => (
                            <tr key={item._id}>
                                <td style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>
                                    {item.userId ? item.userId.username : 'Unknown'}
                                </td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        background: item.userId?.role === 'manager' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                                        fontSize: '0.8rem'
                                    }}>
                                        {item.userId?.role || 'user'}
                                    </span>
                                </td>
                                <td>{new Date(item.startTime).toLocaleDateString()}</td>
                                <td>{new Date(item.startTime).toLocaleTimeString()}</td>
                                <td>
                                    {item.endTime ? new Date(item.endTime).toLocaleTimeString() : <span style={{color: 'var(--success-color)'}}>Active</span>}
                                </td>
                                <td>{item.duration ? formatTime(item.duration) : '-'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No work records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Current Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>
                                    {u.username} {u._id === user.id && '(You)'}
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        background: u.role === 'manager' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                                        color: 'white'
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {u._id !== user.id && (
                                        <button 
                                            onClick={() => toggleRole(u._id, u.role)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--glass-border)',
                                                background: u.role === 'manager' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                color: u.role === 'manager' ? 'var(--danger-color)' : 'var(--success-color)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {u.role === 'manager' ? 'Demote to Employee' : 'Promote to Manager'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;

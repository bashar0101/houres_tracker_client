import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchActiveSession = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/work/active');
          if (res.data) {
              setSession(res.data);
          } else {
              setSession(null);
              setElapsed(0);
          }
      } catch (err) {
          console.error(err);
      }
  };

  const fetchHistory = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/work');
          setHistory(res.data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveSession();
      fetchHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let interval;
    if (session && session.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(session.startTime);
        setElapsed(now - start);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  const startSession = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/work/start');
        setSession(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const stopSession = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/work/stop');
        setSession(null);
        setElapsed(0);
        fetchHistory(); // Refresh history
    } catch (err) {
        console.error(err);
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h1 className="welcome-text">Welcome, <span className="accent-text">{user && user.username}</span></h1>
      </div>

      <div className="timer-card">
        <div className="timer-status">{session ? 'Current Session' : 'Start working'}</div>
        
        <div className="timer-display">
            {session ? formatTime(elapsed) : '0h 0m 0s'}
        </div>

        {session ? (
            <button onClick={stopSession} className="action-btn btn-stop">
                Stop Work
            </button>
        ) : (
            <button onClick={startSession} className="action-btn btn-start">
                Start Work
            </button>
        )}
      </div>

      <div className="history-section">
        <h3 className="section-title">Recent History</h3>
        <div className="history-table-container">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? history.map(item => (
                        <tr key={item._id}>
                            <td>{new Date(item.startTime).toLocaleDateString()}</td>
                            <td>{new Date(item.startTime).toLocaleTimeString()}</td>
                            <td>{item.endTime ? new Date(item.endTime).toLocaleTimeString() : <span style={{color: 'var(--success-color)'}}>Active</span>}</td>
                            <td>{item.duration ? formatTime(item.duration) : '-'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No work history yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

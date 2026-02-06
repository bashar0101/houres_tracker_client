import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload.user);
            setIsAuthenticated(true);
        } catch (e) {
            console.error("Invalid token");
            localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Decode token to get user info immediately or use response if API sends it
      // For now, assuming API sends role in response or we decode token
      // But simpler: just reload user or set state if API returned user object
      // The current loadUser uses /api/auth which we haven't created, 
      // instead we decode token in checkLoggedIn. 
      // Let's rely on checkLoggedIn to verify token and get user payload.
      
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      setUser({ ...payload.user, role: res.data.role }); 
      
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error(err.response.data);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      setUser({ ...payload.user, role: res.data.role });

      setIsAuthenticated(true);
      return true;
    } catch (err) {
        console.error(err.response.data);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

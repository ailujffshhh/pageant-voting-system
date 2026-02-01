import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ children, allowedRoles }) => {
  const [tokenValid, setTokenValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setTokenValid(false);
      return;
    }

    try {
      const decoded = jwt_decode(token);
      const { exp, role } = decoded;
      
      // Check if token is expired
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        setTokenValid(false);
        return;
      }

      // Check if user role is allowed
      if (allowedRoles.includes(role)) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setTokenValid(false);
    }
  }, [location.pathname]);

  if (tokenValid === null) {
    return <div>Loading...</div>;
  }

  return tokenValid ? children : <Navigate to="/" />;
};

export default PrivateRoute;
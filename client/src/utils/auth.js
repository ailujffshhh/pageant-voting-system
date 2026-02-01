import jwt_decode from 'jwt-decode';

// Check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt_decode(token);
    const { exp } = decoded;
    
    // Check if token is expired
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt_decode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

// Get user ID from token
export const getUserId = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt_decode(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};
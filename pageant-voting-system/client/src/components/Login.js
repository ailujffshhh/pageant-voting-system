import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth', formData);
      
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Decode token to get user role
      const decoded = jwt_decode(res.data.token);
      const { role } = decoded;
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'judge') {
        navigate('/judge/vote');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '5rem' }}>
        <Typography variant="h4" gutterBottom align="center">
          Pageant Voting System
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          Judge & Admin Portal
        </Typography>
        
        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            margin="normal"
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            style={{ marginBottom: '1rem' }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            style={{ marginBottom: '1rem' }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Login
          </Button>
        </form>
        
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Demo Accounts:
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Admin: admin@example.com / password123
          </Typography>
          <br />
          <Typography variant="caption" color="textSecondary">
            Judge: judge@example.com / password123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
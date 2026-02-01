import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import Components
import Login from './components/Login';
import AdminDashboard from './views/AdminDashboard';
import JudgeVote from './views/JudgeVote';
import Results from './views/Results';
import PrivateRoute from './components/PrivateRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/judge/*" 
              element={
                <PrivateRoute allowedRoles={['judge']}>
                  <JudgeVote />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <PrivateRoute allowedRoles={['admin', 'judge']}>
                  <Results />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
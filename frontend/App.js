import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CallList from './components/CallList';
import CallUpload from './components/CallUpload';
import EvaluationForm from './components/EvaluationForm';
import EvaluationResults from './components/EvaluationResults';
import EvaluationList from './components/EvaluationList';
import UserProfile from './components/UserProfile';
import UserManagement from './components/UserManagement';
import CriteriaManagement from './components/CriteriaManagement';

// Redux
import { checkAuthStatus } from './store/authSlice';

// Tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Korumalı Route bileşeni
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return null; // Yükleme durumunda hiçbir şey gösterme
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Rol bazlı korumalı Route bileşeni
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  
  if (loading) {
    return null; // Yükleme durumunda hiçbir şey gösterme
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/calls" element={
              <ProtectedRoute>
                <CallList />
              </ProtectedRoute>
            } />
            
            <Route path="/calls/upload" element={
              <ProtectedRoute>
                <CallUpload />
              </ProtectedRoute>
            } />
            
            <Route path="/evaluate/:callId" element={
              <ProtectedRoute>
                <EvaluationForm />
              </ProtectedRoute>
            } />
            
            <Route path="/evaluations" element={
              <ProtectedRoute>
                <EvaluationList />
              </ProtectedRoute>
            } />
            
            <Route path="/evaluations/:evaluationId" element={
              <ProtectedRoute>
                <EvaluationResults />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </RoleProtectedRoute>
            } />
            
            <Route path="/criteria" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <CriteriaManagement />
              </RoleProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { refreshToken } from './store/authSlice';

// Components
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CallList from './components/CallList';
import CallUpload from './components/CallUpload';
import EvaluationForm from './components/EvaluationForm';
import EvaluationResults from './components/EvaluationResults';
import EvaluationList from './components/EvaluationList';
import UserManagement from './components/UserManagement';
import CriteriaManagement from './components/CriteriaManagement';
import QueueManagement from './components/QueueManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component - Sadece admin rolündeki kullanıcıların erişebildiği sayfalar için
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Login Route Component - Kullanıcı giriş yapmışsa ana sayfaya yönlendir
const LoginRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);
  
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={
            <LoginRoute>
              <LoginForm />
            </LoginRoute>
          } />
          
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
          
          <Route path="/calls/:callId/evaluate" element={
            <ProtectedRoute>
              <EvaluationForm />
            </ProtectedRoute>
          } />
          
          <Route path="/calls/new/evaluate" element={
            <ProtectedRoute>
              <EvaluationForm />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          
          <Route path="/criteria" element={
            <AdminRoute>
              <CriteriaManagement />
            </AdminRoute>
          } />
          
          <Route path="/queues" element={
            <AdminRoute>
              <QueueManagement />
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App; 
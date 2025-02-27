import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3
          }}>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                p: 1.5, 
                mb: 2 
              }}
            >
              <LockOutlined sx={{ color: 'white' }} />
            </Box>
            <Typography component="h1" variant="h5">
              Çağrı Merkezi Kalite Yönetimi
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Lütfen giriş yapın
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Demo: username: admin, password: admin123
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm; 
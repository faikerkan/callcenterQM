import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Başarı mesajını temizle
    if (success) {
      setSuccess(false);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name) {
      errors.first_name = 'Ad alanı gereklidir.';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Soyad alanı gereklidir.';
    }
    
    if (!formData.email) {
      errors.email = 'E-posta alanı gereklidir.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz.';
    }
    
    // Şifre değişikliği yapılıyorsa kontrol et
    if (formData.new_password || formData.confirm_password) {
      if (!formData.current_password) {
        errors.current_password = 'Mevcut şifrenizi girmelisiniz.';
      }
      
      if (formData.new_password.length < 8) {
        errors.new_password = 'Şifre en az 8 karakter olmalıdır.';
      }
      
      if (formData.new_password !== formData.confirm_password) {
        errors.confirm_password = 'Şifreler eşleşmiyor.';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await dispatch(updateUserProfile({
        userId: user.id,
        userData: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          current_password: formData.current_password,
          new_password: formData.new_password
        }
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccess(true);
        // Şifre alanlarını temizle
        setFormData({
          ...formData,
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    }
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'expert':
        return 'Uzman';
      case 'agent':
        return 'Müşteri Temsilcisi';
      default:
        return role;
    }
  };
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'expert':
        return 'primary';
      case 'agent':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Profil Bilgileri
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profil bilgileriniz başarıyla güncellendi.
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}
            >
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </Avatar>
            
            <Typography variant="h6">
              {user?.first_name} {user?.last_name}
            </Typography>
            
            <Chip
              label={getRoleLabel(user?.role)}
              color={getRoleColor(user?.role)}
              sx={{ mt: 1 }}
            />
            
            <Box sx={{ mt: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BadgeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Sicil No: {user?.employee_id || 'Belirtilmemiş'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'E-posta belirtilmemiş'}
                </Typography>
              </Box>
              
              {user?.team && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Takım: {user.team}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Profil Düzenle
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ad"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={!!formErrors.first_name}
                    helperText={formErrors.first_name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Soyad"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    error={!!formErrors.last_name}
                    helperText={formErrors.last_name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-posta"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Şifre Değiştir
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mevcut Şifre"
                    name="current_password"
                    type="password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    error={!!formErrors.current_password}
                    helperText={formErrors.current_password}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Yeni Şifre"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    error={!!formErrors.new_password}
                    helperText={formErrors.new_password}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Yeni Şifre (Tekrar)"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    error={!!formErrors.confirm_password}
                    helperText={formErrors.confirm_password}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Kaydet'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile; 
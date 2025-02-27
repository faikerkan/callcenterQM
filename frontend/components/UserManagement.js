import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../store/usersSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' veya 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'agent',
    employee_id: '',
    team: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.employee_id?.toLowerCase().includes(searchLower) ||
      user.team?.toLowerCase().includes(searchLower)
    );
  });
  
  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    
    if (mode === 'edit' && user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        confirm_password: '',
        role: user.role || 'agent',
        employee_id: user.employee_id || '',
        team: user.team || ''
      });
    } else {
      // Yeni kullanıcı oluşturma
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'agent',
        employee_id: '',
        team: ''
      });
    }
    
    setFormErrors({});
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormErrors({});
  };
  
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
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Kullanıcı adı gereklidir.';
    }
    
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
    
    if (dialogMode === 'create') {
      if (!formData.password) {
        errors.password = 'Şifre alanı gereklidir.';
      } else if (formData.password.length < 8) {
        errors.password = 'Şifre en az 8 karakter olmalıdır.';
      }
      
      if (formData.password !== formData.confirm_password) {
        errors.confirm_password = 'Şifreler eşleşmiyor.';
      }
    } else if (dialogMode === 'edit' && formData.password) {
      // Şifre değişikliği yapılıyorsa kontrol et
      if (formData.password.length < 8) {
        errors.password = 'Şifre en az 8 karakter olmalıdır.';
      }
      
      if (formData.password !== formData.confirm_password) {
        errors.confirm_password = 'Şifreler eşleşmiyor.';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      const userData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role,
        employee_id: formData.employee_id,
        team: formData.team
      };
      
      if (formData.password) {
        userData.password = formData.password;
      }
      
      let result;
      
      if (dialogMode === 'create') {
        result = await dispatch(createUser(userData));
      } else {
        result = await dispatch(updateUser({
          userId: selectedUser.id,
          userData
        }));
      }
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSnackbar({
          open: true,
          message: dialogMode === 'create' 
            ? 'Kullanıcı başarıyla oluşturuldu.' 
            : 'Kullanıcı başarıyla güncellendi.',
          severity: 'success'
        });
        handleCloseDialog();
      } else {
        setSnackbar({
          open: true,
          message: 'İşlem sırasında bir hata oluştu.',
          severity: 'error'
        });
      }
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      const result = await dispatch(deleteUser(userId));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSnackbar({
          open: true,
          message: 'Kullanıcı başarıyla silindi.',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Kullanıcı silinirken bir hata oluştu.',
          severity: 'error'
        });
      }
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
        Kullanıcı Yönetimi
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '40%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Yeni Kullanıcı
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kullanıcı Adı</TableCell>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Sicil No</TableCell>
                  <TableCell>Takım</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.employee_id || '-'}</TableCell>
                      <TableCell>{user.team || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog('edit', user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {searchTerm
                        ? 'Arama kriterlerine uygun kullanıcı bulunamadı.'
                        : 'Henüz kullanıcı bulunmuyor.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Kullanıcı Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcı Düzenle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  <MenuItem value="admin">Yönetici</MenuItem>
                  <MenuItem value="expert">Uzman</MenuItem>
                  <MenuItem value="agent">Müşteri Temsilcisi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sicil No"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Takım"
                name="team"
                value={formData.team}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                {dialogMode === 'create' ? 'Şifre' : 'Şifre Değiştir'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Şifre"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={dialogMode === 'create'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Şifre (Tekrar)"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                error={!!formErrors.confirm_password}
                helperText={formErrors.confirm_password}
                required={dialogMode === 'create'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement; 
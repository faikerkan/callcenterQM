import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  clearErrors, 
  clearSuccess 
} from '../store/usersSlice';

// Roller için sabit değişkenler
const ROLES = [
  { value: 'admin', label: 'Yönetici' },
  { value: 'expert', label: 'Kalite Uzmanı' },
  { value: 'agent', label: 'Müşteri Temsilcisi' }
];

// Takımlar için sabit değişkenler
const TEAMS = [
  { value: 'Yönetim', label: 'Yönetim' },
  { value: 'Kalite Kontrol', label: 'Kalite Kontrol' },
  { value: 'Müşteri Hizmetleri', label: 'Müşteri Hizmetleri' },
  { value: 'Teknik Destek', label: 'Teknik Destek' },
  { value: 'Satış', label: 'Satış' }
];

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector(state => state.users);
  
  // Dialog durumu
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' veya 'edit'
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Form alanları
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    team: '',
    employeeId: '',
    isActive: true
  });
  
  // Form hataları
  const [formErrors, setFormErrors] = useState({});
  
  // Snackbar durumu
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Arama ve filtreleme
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Kullanıcıları yükleme
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Kullanıcıları filtreleme
  useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.team.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [users, searchTerm]);
  
  // Arama kutusunu temizle
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Dialog açma/kapatma
  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    
    if (mode === 'create') {
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'agent', // Varsayılan
        team: '',
        employeeId: '',
        isActive: true
      });
      setSelectedUserId(null);
    } else if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        team: user.team,
        employeeId: user.employeeId,
        isActive: user.isActive
      });
      setSelectedUserId(user.id);
    }
    
    setFormErrors({});
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
    setFormErrors({});
  };
  
  // Form değişikliklerini yakala
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
        [name]: null
      });
    }
  };
  
  // Form doğrulama
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) errors.username = 'Kullanıcı adı gereklidir';
    if (!formData.firstName) errors.firstName = 'Ad gereklidir';
    if (!formData.lastName) errors.lastName = 'Soyad gereklidir';
    if (!formData.email) errors.email = 'E-posta gereklidir';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Geçerli bir e-posta adresi giriniz';
    
    if (dialogMode === 'create') {
      if (!formData.password) errors.password = 'Şifre gereklidir';
      else if (formData.password.length < 6) errors.password = 'Şifre en az 6 karakter olmalıdır';
      
      if (!formData.confirmPassword) errors.confirmPassword = 'Şifre tekrarı gereklidir';
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Şifreler eşleşmiyor';
    } else if (dialogMode === 'edit' && formData.password) {
      if (formData.password.length < 6) errors.password = 'Şifre en az 6 karakter olmalıdır';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    if (!formData.role) errors.role = 'Rol gereklidir';
    if (!formData.team) errors.team = 'Takım gereklidir';
    if (!formData.employeeId) errors.employeeId = 'Çalışan ID gereklidir';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Formu gönder
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Şifre alanını kontrol et (düzenleme modunda boş olabilir)
    const userData = { ...formData };
    delete userData.confirmPassword;
    
    if (dialogMode === 'edit' && !userData.password) {
      delete userData.password;
    }
    
    try {
      if (dialogMode === 'create') {
        const resultAction = await dispatch(createUser(userData));
        if (createUser.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: 'Kullanıcı başarıyla eklendi',
            severity: 'success'
          });
          handleCloseDialog();
        } else if (createUser.rejected.match(resultAction)) {
          throw new Error(resultAction.payload || resultAction.error.message || 'Kullanıcı eklenirken bir hata oluştu');
        }
      } else if (dialogMode === 'edit') {
        const resultAction = await dispatch(updateUser({ userId: selectedUserId, userData }));
        if (updateUser.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: 'Kullanıcı başarıyla güncellendi',
            severity: 'success'
          });
          handleCloseDialog();
        } else if (updateUser.rejected.match(resultAction)) {
          throw new Error(resultAction.payload || resultAction.error.message || 'Kullanıcı güncellenirken bir hata oluştu');
        }
      }
    } catch (err) {
      console.error('İşlem hatası:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
        severity: 'error'
      });
    }
  };
  
  // Kullanıcı silme
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        setSnackbar({
          open: true,
          message: 'Kullanıcı başarıyla devre dışı bırakıldı',
          severity: 'success'
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || 'Kullanıcı silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    }
  };
  
  // Snackbar kapatma
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
    
    dispatch(clearErrors());
    dispatch(clearSuccess());
  };
  
  // Rol etiketinin rengini belirle
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'expert':
        return 'Kalite Uzmanı';
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
        return 'info';
      case 'agent':
        return 'success';
      default:
        return 'default';
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && users.length === 0) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Kullanıcı Yönetimi
        </Typography>
        
        <TextField
          size="small"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ width: 250, mr: 2 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          Yeni Kullanıcı
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Çalışan ID</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Takım</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleLabel(user.role)} 
                      color={getRoleColor(user.role)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isActive ? 'Aktif' : 'Pasif'} 
                      color={user.isActive ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog('edit', user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={!user.isActive} // Zaten pasif kullanıcılar için devre dışı
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {searchTerm
                    ? 'Arama kriterlerine uygun kullanıcı bulunamadı.'
                    : 'Henüz kullanıcı bulunmuyor.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Kullanıcı Ekleme/Düzenleme Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Kullanıcı Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                disabled={dialogMode === 'edit'} // Düzenleme modunda kullanıcı adı değiştirilemesin
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Çalışan ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                error={!!formErrors.employeeId}
                helperText={formErrors.employeeId}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Soyad"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.role}>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  {ROLES.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.team}>
                <InputLabel>Takım</InputLabel>
                <Select
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  label="Takım"
                >
                  {TEAMS.map(team => (
                    <MenuItem key={team.value} value={team.value}>
                      {team.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.team && <FormHelperText>{formErrors.team}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  label="Durum"
                >
                  <MenuItem value={true}>Aktif</MenuItem>
                  <MenuItem value={false}>Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Şifre Bilgileri {dialogMode === 'edit' && '(Değişmeyecekse boş bırakın)'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Şifre Tekrarı"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : (dialogMode === 'create' ? <PersonAddIcon /> : <EditIcon />)}
          >
            {dialogMode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement; 
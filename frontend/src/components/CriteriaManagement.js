import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Chip,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { 
  fetchCriteria,
  createCriterion,
  updateCriterion,
  deleteCriterion,
  clearErrors,
  clearSuccess
} from '../store/criteriaSlice';

const CriteriaManagement = () => {
  const dispatch = useDispatch();
  const { criteria, loading, error, success, totalWeight } = useSelector(state => state.criteria);
  
  // Yerel state
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: 10
  });
  
  // Kriterleri yükle
  useEffect(() => {
    dispatch(fetchCriteria());
  }, [dispatch]);
  
  // Başarı ve hata durumlarını yakala
  useEffect(() => {
    if (success) {
      setSnackbarMessage(
        dialogMode === 'add' 
          ? 'Değerlendirme kriteri başarıyla eklendi.' 
          : dialogMode === 'edit'
            ? 'Değerlendirme kriteri başarıyla güncellendi.'
            : 'Değerlendirme kriteri başarıyla silindi.'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Dialog'u kapat
      if (dialogOpen) {
        handleCloseDialog();
      }
      
      dispatch(clearSuccess());
    }
    
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      dispatch(clearErrors());
    }
  }, [success, error, dialogMode, dialogOpen, dispatch]);
  
  // Arama
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Arama terimine göre kriterleri filtrele
  const filteredCriteria = criteria.filter(criterion =>
    criterion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criterion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Dialog işlemleri
  const handleOpenDialog = (mode, criterion = null) => {
    setDialogMode(mode);
    
    if (mode === 'add') {
      // Yeni kriter için boş form
      setFormData({
        name: '',
        description: '',
        weight: 10
      });
    } else if (mode === 'edit' && criterion) {
      // Mevcut kriteri düzenlemek için formu doldur
      setFormData({
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight
      });
      setSelectedCriterion(criterion);
    } else if (mode === 'delete' && criterion) {
      setSelectedCriterion(criterion);
      setDeleteDialogOpen(true);
      return; // Delete için ayrı dialog kullanılıyor
    }
    
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      weight: 10
    });
  };
  
  // Form işlemleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleWeightChange = (event, newValue) => {
    setFormData({
      ...formData,
      weight: newValue
    });
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setSnackbarMessage('Kriter adı gereklidir');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    
    if (!formData.description.trim()) {
      setSnackbarMessage('Kriter açıklaması gereklidir');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    
    if (formData.weight <= 0 || formData.weight > 100) {
      setSnackbarMessage('Ağırlık 1-100 arasında olmalıdır');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (dialogMode === 'add') {
      await dispatch(createCriterion(formData));
    } else if (dialogMode === 'edit' && selectedCriterion) {
      await dispatch(updateCriterion({
        criterionId: selectedCriterion.id,
        criterionData: formData
      }));
    }
  };
  
  const handleDeleteCriterion = async (criterionId) => {
    setDeleteDialogOpen(false);
    
    try {
      await dispatch(deleteCriterion(criterionId)).unwrap();
      
      setSnackbarMessage('Değerlendirme kriteri başarıyla silindi');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Değerlendirme kriteri silinirken bir hata oluştu');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Değerlendirme Kriterleri Yönetimi
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Değerlendirme kriterlerinizi ekleyin, düzenleyin veya silin. Toplam ağırlık 100 olacak şekilde ayarlanması önerilir.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Yeni Kriter Ekle
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={`Toplam Ağırlık: ${totalWeight}/100`}
              color={totalWeight === 100 ? "success" : "warning"}
              sx={{ mr: 2 }}
            />
            
            <TextField
              placeholder="Kriter Ara..."
              variant="outlined"
              size="small"
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
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
        
        {totalWeight !== 100 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Kriterlerin toplam ağırlığı {totalWeight}%. İdeal değerlendirme için toplam ağırlık 100% olmalıdır.
              </Typography>
            </Box>
          </Alert>
        )}
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kriter Adı</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell align="center">Ağırlık (%)</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCriteria.length > 0 ? (
                filteredCriteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell>{criterion.name}</TableCell>
                    <TableCell>{criterion.description}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${criterion.weight}%`}
                        size="small"
                        color={
                          criterion.weight <= 5 ? "info" :
                          criterion.weight <= 10 ? "success" :
                          "primary"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', criterion)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDialog('delete', criterion)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {searchTerm ? (
                      'Arama kriterlerinize uygun değerlendirme kriteri bulunamadı.'
                    ) : (
                      'Henüz değerlendirme kriteri bulunmuyor. Lütfen yeni kriter ekleyin.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Kriter Ekleme/Düzenleme Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Yeni Değerlendirme Kriteri Ekle' : 'Değerlendirme Kriterini Düzenle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Kriter Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Ağırlık (%) - Kriterin toplam değerlendirmedeki ağırlığını belirler
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.weight}
                  onChange={handleWeightChange}
                  aria-labelledby="weight-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' }
                  ]}
                  min={0}
                  max={100}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Not: Tüm kriterlerin toplam ağırlığı 100% olacak şekilde ayarlamanız önerilir.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            İptal
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (dialogMode === 'add' ? 'Ekle' : 'Güncelle')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme Onay Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Kriteri Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedCriterion?.name}" kriterini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            İptal
          </Button>
          <Button 
            onClick={() => handleDeleteCriterion(selectedCriterion?.id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CriteriaManagement; 
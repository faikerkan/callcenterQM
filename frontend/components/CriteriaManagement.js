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
  Grid,
  Slider,
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
  fetchCriteria, 
  createCriterion, 
  updateCriterion, 
  deleteCriterion 
} from '../store/criteriaSlice';

const CriteriaManagement = () => {
  const dispatch = useDispatch();
  const { criteria, loading, error } = useSelector((state) => state.criteria);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' veya 'edit'
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: 10
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    dispatch(fetchCriteria());
  }, [dispatch]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const filteredCriteria = criteria.filter(criterion => {
    const searchLower = searchTerm.toLowerCase();
    return (
      criterion.name.toLowerCase().includes(searchLower) ||
      criterion.description.toLowerCase().includes(searchLower)
    );
  });
  
  const handleOpenDialog = (mode, criterion = null) => {
    setDialogMode(mode);
    setSelectedCriterion(criterion);
    
    if (mode === 'edit' && criterion) {
      setFormData({
        name: criterion.name || '',
        description: criterion.description || '',
        weight: criterion.weight || 10
      });
    } else {
      // Yeni kriter oluşturma
      setFormData({
        name: '',
        description: '',
        weight: 10
      });
    }
    
    setFormErrors({});
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCriterion(null);
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
  
  const handleWeightChange = (event, newValue) => {
    setFormData({
      ...formData,
      weight: newValue
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = 'Kriter adı gereklidir.';
    }
    
    if (!formData.description) {
      errors.description = 'Açıklama gereklidir.';
    }
    
    if (formData.weight < 1 || formData.weight > 100) {
      errors.weight = 'Ağırlık 1-100 arasında olmalıdır.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      const criterionData = {
        name: formData.name,
        description: formData.description,
        weight: formData.weight
      };
      
      let result;
      
      if (dialogMode === 'create') {
        result = await dispatch(createCriterion(criterionData));
      } else {
        result = await dispatch(updateCriterion({
          criterionId: selectedCriterion.id,
          criterionData
        }));
      }
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSnackbar({
          open: true,
          message: dialogMode === 'create' 
            ? 'Değerlendirme kriteri başarıyla oluşturuldu.' 
            : 'Değerlendirme kriteri başarıyla güncellendi.',
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
  
  const handleDeleteCriterion = async (criterionId) => {
    if (window.confirm('Bu değerlendirme kriterini silmek istediğinizden emin misiniz?')) {
      const result = await dispatch(deleteCriterion(criterionId));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSnackbar({
          open: true,
          message: 'Değerlendirme kriteri başarıyla silindi.',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Değerlendirme kriteri silinirken bir hata oluştu.',
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
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Değerlendirme Kriterleri Yönetimi
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Kriter ara..."
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
            Yeni Kriter
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
                  <TableCell>Kriter Adı</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Ağırlık (%)</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCriteria.length > 0 ? (
                  filteredCriteria.map((criterion) => (
                    <TableRow key={criterion.id}>
                      <TableCell>{criterion.name}</TableCell>
                      <TableCell>{criterion.description}</TableCell>
                      <TableCell>{criterion.weight}%</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog('edit', criterion)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCriterion(criterion.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {searchTerm
                        ? 'Arama kriterlerine uygun değerlendirme kriteri bulunamadı.'
                        : 'Henüz değerlendirme kriteri bulunmuyor.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Kriter Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Yeni Değerlendirme Kriteri Ekle' : 'Değerlendirme Kriterini Düzenle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kriter Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                multiline
                rows={3}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>
                Ağırlık (%)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.weight}
                  onChange={handleWeightChange}
                  aria-labelledby="weight-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={100}
                  error={!!formErrors.weight}
                />
                {formErrors.weight && (
                  <Typography color="error" variant="caption">
                    {formErrors.weight}
                  </Typography>
                )}
              </Box>
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

export default CriteriaManagement; 
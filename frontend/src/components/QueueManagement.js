import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  fetchQueues, 
  createQueue, 
  updateQueue, 
  deleteQueue, 
  clearErrors, 
  clearSuccess, 
  setCurrentQueue 
} from '../store/queuesSlice';
import { fetchUsers } from '../store/usersSlice';

const QueueManagement = () => {
  const dispatch = useDispatch();
  const { queues, loading, error, success } = useSelector(state => state.queues);
  const { users } = useSelector(state => state.users);
  
  // Yerel state
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 1,
    sla: 60,
    agents: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [queueToDelete, setQueueToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Kuyrukları ve kullanıcıları yükle
  useEffect(() => {
    dispatch(fetchQueues());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Filtreleme işlemi
  useEffect(() => {
    if (queues) {
      setFilteredQueues(
        queues.filter(queue => 
          queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          queue.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [queues, searchTerm]);
  
  // Başarı ve hata durumlarını yönet
  useEffect(() => {
    if (success) {
      setOpen(false);
      setDeleteConfirmOpen(false);
      setSnackbarOpen(true);
      
      // 3 saniye sonra success state'ini temizle
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);
  
  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priority: 1,
      sla: 60,
      agents: []
    });
    setFormErrors({});
  };
  
  // Dialog'u aç
  const handleOpenDialog = (mode, queue = null) => {
    setDialogMode(mode);
    resetForm();
    
    if (mode === 'edit' && queue) {
      setFormData({
        id: queue.id,
        name: queue.name,
        description: queue.description,
        priority: queue.priority,
        sla: queue.sla,
        active: queue.active,
        agents: queue.agents || []
      });
      dispatch(setCurrentQueue(queue));
    }
    
    setOpen(true);
  };
  
  // Dialog'u kapat
  const handleCloseDialog = () => {
    setOpen(false);
    resetForm();
    dispatch(clearErrors());
  };
  
  // Form alanlarını değiştir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Formu doğrula
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Kuyruk adı gereklidir';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Açıklama gereklidir';
    }
    
    if (formData.priority < 1 || formData.priority > 10) {
      errors.priority = 'Öncelik 1-10 arasında olmalıdır';
    }
    
    if (formData.sla < 0) {
      errors.sla = 'SLA süresi 0 veya daha büyük olmalıdır';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Formu gönder
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (dialogMode === 'add') {
      dispatch(createQueue(formData))
        .unwrap()
        .catch(err => {
          console.error('Kuyruk eklenirken hata oluştu:', err);
        });
    } else {
      const queueId = formData.id;
      
      if (!queueId) {
        console.error('Kuyruk ID bulunamadı');
        return;
      }
      
      dispatch(updateQueue({ 
        queueId: queueId, 
        queueData: formData 
      }))
        .unwrap()
        .catch(err => {
          console.error('Kuyruk güncellenirken hata oluştu:', err);
        });
    }
  };
  
  // Silme onayı dialog'unu aç
  const handleDeleteConfirm = (queue) => {
    setQueueToDelete(queue);
    setDeleteConfirmOpen(true);
  };
  
  // Kuyruğu sil
  const handleDelete = () => {
    if (queueToDelete) {
      dispatch(deleteQueue(queueToDelete.id))
        .unwrap()
        .catch(err => {
          console.error('Kuyruk silinirken hata oluştu:', err);
        });
    }
  };
  
  // Snackbar'ı kapat
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Temsilci seçimini yönet
  const handleAgentChange = (event) => {
    setFormData(prev => ({
      ...prev,
      agents: event.target.value
    }));
  };
  
  // Aktif temsilcileri filtrele
  const activeAgents = users.filter(user => 
    (user.role === 'agent' || user.role === 'expert') && user.isActive
  );
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Çağrı Kuyrukları Yönetimi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Yeni Kuyruk Ekle
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Kuyruk ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Tooltip title="Yenile">
            <IconButton onClick={() => dispatch(fetchQueues())}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="kuyruklar tablosu">
            <TableHead>
              <TableRow>
                <TableCell>Kuyruk Adı</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell align="center">Öncelik</TableCell>
                <TableCell align="center">SLA (sn)</TableCell>
                <TableCell align="center">Temsilciler</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Yükleniyor...</TableCell>
                </TableRow>
              ) : filteredQueues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Kuyruk bulunamadı</TableCell>
                </TableRow>
              ) : (
                filteredQueues.map((queue) => (
                  <TableRow key={queue.id} hover>
                    <TableCell component="th" scope="row">
                      {queue.name}
                    </TableCell>
                    <TableCell>{queue.description}</TableCell>
                    <TableCell align="center">{queue.priority}</TableCell>
                    <TableCell align="center">{queue.sla}</TableCell>
                    <TableCell align="center">
                      {queue.agents && queue.agents.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                          {queue.agents.map(agentId => {
                            const agent = users.find(user => user.id === agentId);
                            return agent ? (
                              <Chip 
                                key={agentId} 
                                label={`${agent.firstName} ${agent.lastName}`} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                            ) : null;
                          })}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Temsilci atanmamış
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={queue.active ? "Aktif" : "Pasif"} 
                        color={queue.active ? "success" : "default"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Düzenle">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenDialog('edit', queue)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteConfirm(queue)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Kuyruk Ekleme/Düzenleme Dialog'u */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Yeni Kuyruk Ekle' : 'Kuyruğu Düzenle'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Kuyruk Adı"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    name="active"
                    color="primary"
                  />
                }
                label="Aktif"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="priority"
                label="Öncelik (1-10)"
                type="number"
                fullWidth
                value={formData.priority}
                onChange={handleChange}
                error={!!formErrors.priority}
                helperText={formErrors.priority}
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="sla"
                label="SLA (saniye)"
                type="number"
                fullWidth
                value={formData.sla}
                onChange={handleChange}
                error={!!formErrors.sla}
                helperText={formErrors.sla}
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="agents-label">Temsilciler</InputLabel>
                <Select
                  labelId="agents-label"
                  multiple
                  value={formData.agents || []}
                  onChange={handleAgentChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((agentId) => {
                        const agent = users.find(user => user.id === agentId);
                        return agent ? (
                          <Chip 
                            key={agentId} 
                            label={`${agent.firstName} ${agent.lastName}`} 
                            size="small" 
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {activeAgents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {`${agent.firstName} ${agent.lastName} (${agent.team})`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Kuyruğa atanacak temsilcileri seçin</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme Onayı Dialog'u */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Kuyruğu Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{queueToDelete?.name}" kuyruğunu silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>İptal</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim Snackbar'ı */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {dialogMode === 'add' 
            ? 'Kuyruk başarıyla eklendi' 
            : dialogMode === 'edit' 
              ? 'Kuyruk başarıyla güncellendi' 
              : 'Kuyruk başarıyla silindi'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QueueManagement; 
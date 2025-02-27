import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadCall, clearUploadSuccess } from '../store/callsSlice';
import { useNavigate } from 'react-router-dom';

const CallUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, uploadSuccess } = useSelector((state) => state.calls);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    agent_name: '',
    phone_number: '',
    call_date: '',
    queue: '',
    audio_file: null
  });
  
  const [audioFileName, setAudioFileName] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Kullanıcı admin veya expert değilse, kendi adını otomatik doldur
  useEffect(() => {
    if (user && user.role === 'agent') {
      setFormData(prev => ({
        ...prev,
        agent_name: `${user.first_name} ${user.last_name}`.trim()
      }));
    }
  }, [user]);
  
  // Başarılı yükleme durumunda snackbar göster
  useEffect(() => {
    if (uploadSuccess) {
      setSnackbarOpen(true);
      // Form verilerini sıfırla
      setFormData({
        agent_name: user && user.role === 'agent' ? `${user.first_name} ${user.last_name}`.trim() : '',
        phone_number: '',
        call_date: '',
        queue: '',
        audio_file: null
      });
      setAudioFileName('');
      
      // 3 saniye sonra çağrı listesine yönlendir
      const timer = setTimeout(() => {
        dispatch(clearUploadSuccess());
        navigate('/calls');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess, dispatch, navigate, user]);
  
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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'audio/mpeg' && file.type !== 'audio/mp3') {
        setFormErrors({
          ...formErrors,
          audio_file: 'Sadece MP3 dosyaları yüklenebilir.'
        });
        return;
      }
      
      setFormData({
        ...formData,
        audio_file: file
      });
      setAudioFileName(file.name);
      
      // Hata mesajını temizle
      if (formErrors.audio_file) {
        setFormErrors({
          ...formErrors,
          audio_file: ''
        });
      }
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.agent_name) {
      errors.agent_name = 'Müşteri temsilcisi adı gereklidir.';
    }
    
    if (!formData.phone_number) {
      errors.phone_number = 'Telefon numarası gereklidir.';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone_number)) {
      errors.phone_number = 'Geçerli bir telefon numarası giriniz.';
    }
    
    if (!formData.call_date) {
      errors.call_date = 'Çağrı tarihi gereklidir.';
    }
    
    if (!formData.queue) {
      errors.queue = 'Çağrı kuyruğu gereklidir.';
    }
    
    if (!formData.audio_file) {
      errors.audio_file = 'Ses dosyası gereklidir.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(uploadCall(formData));
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Yeni Çağrı Yükle
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Müşteri Temsilcisi"
                name="agent_name"
                value={formData.agent_name}
                onChange={handleInputChange}
                disabled={user && user.role === 'agent'}
                error={!!formErrors.agent_name}
                helperText={formErrors.agent_name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon Numarası"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+905551234567"
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Çağrı Tarihi"
                name="call_date"
                type="datetime-local"
                value={formData.call_date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!formErrors.call_date}
                helperText={formErrors.call_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.queue} required>
                <InputLabel>Çağrı Kuyruğu</InputLabel>
                <Select
                  name="queue"
                  value={formData.queue}
                  onChange={handleInputChange}
                  label="Çağrı Kuyruğu"
                >
                  <MenuItem value="Satış">Satış</MenuItem>
                  <MenuItem value="Destek">Destek</MenuItem>
                  <MenuItem value="Teknik">Teknik</MenuItem>
                  <MenuItem value="Şikayet">Şikayet</MenuItem>
                  <MenuItem value="Bilgi">Bilgi</MenuItem>
                </Select>
                {formErrors.queue && (
                  <Typography variant="caption" color="error">
                    {formErrors.queue}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center' }}>
                <input
                  accept="audio/mp3,audio/mpeg"
                  style={{ display: 'none' }}
                  id="audio-file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="audio-file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Ses Dosyası Seç
                  </Button>
                </label>
                
                <Box sx={{ mt: 2 }}>
                  {audioFileName ? (
                    <Typography variant="body2">
                      Seçilen dosya: {audioFileName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      MP3 formatında ses dosyası yükleyin
                    </Typography>
                  )}
                </Box>
                
                {formErrors.audio_file && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {formErrors.audio_file}
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => navigate('/calls')}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Yükle'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Çağrı başarıyla yüklendi!"
      />
    </Box>
  );
};

export default CallUpload; 
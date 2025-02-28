import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AudioFile as AudioFileIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';

// Not: Redux entegrasyonu henüz yapılmadı
// import { uploadCalls } from '../store/callsSlice';

const CallUpload = () => {
  const dispatch = useDispatch();
  
  // Gerçek uygulamada Redux state'den veri alınacak
  // const { uploading, uploadSuccess, uploadError } = useSelector(state => state.calls);
  
  // Stepper için adımlar
  const steps = ['Dosya Seçimi', 'Meta Veri', 'Yükleme'];
  
  // State'ler
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    queue: '',
    agentName: '',
    callDate: '',
    isInbound: true
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Yükleme için örnek kuyruk seçenekleri
  const queueOptions = [
    'Destek',
    'Satış',
    'Teknik Destek',
    'Müşteri Hizmetleri',
    'Fatura İşlemleri'
  ];
  
  // Adım fonksiyonları
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleUpload();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setSelectedFiles([]);
    setFormData({
      queue: '',
      agentName: '',
      callDate: '',
      isInbound: true
    });
    setUploadSuccess(false);
    setUploadError(null);
  };
  
  // Dosya işleme fonksiyonları
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Dosya boyutu kontrolü (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük. Maksimum 20MB yükleyebilirsiniz.');
        return;
      }
      
      // Ses dosyası olduğundan emin olalım
      if (!file.type.includes('audio/')) {
        alert('Sadece ses dosyaları yükleyebilirsiniz.');
        return;
      }
      
      // Dosyayı önizleme için yükleyelim
      const objectUrl = URL.createObjectURL(file);
      
      // Geçici bir Audio nesnesi ile dosyanın çalınabilir olduğunu kontrol edelim
      const testAudio = new Audio(objectUrl);
      testAudio.addEventListener('error', () => {
        alert('Bu ses dosyası oynatılamıyor veya desteklenmeyen bir formatta.');
        URL.revokeObjectURL(objectUrl); // URL'yi temizle
        return;
      });
      
      // Eğer dosya geçerliyse, seçilmiş dosya olarak ayarlayalım
      setSelectedFile(file);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      // Dosya seçildikten sonra input alanını temizleyelim
      event.target.value = '';
    }
  };
  
  const handleRemoveFile = (fileIndex) => {
    setFileToDelete(fileIndex);
    setDeleteDialogOpen(true);
  };
  
  const confirmRemoveFile = () => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== fileToDelete)
    );
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };
  
  // Form değişiklik fonksiyonları
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Lütfen yüklenecek dosya seçin');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      // Gerçek uygulamada Redux action'ını çağırır ve dosyaları yükleriz
      // const formDataToSend = new FormData();
      // selectedFiles.forEach(file => {
      //   formDataToSend.append('files', file);
      // });
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key]);
      // });
      // await dispatch(uploadCalls(formDataToSend)).unwrap();
      
      // Simüle edilmiş yükleme
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
    } catch (error) {
      setUploadError('Dosya yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };
  
  // Adım içeriklerini oluştur
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Çağrı Kayıtlarını Seçin
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Dosya Seç
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              
              <Typography variant="body2" color="textSecondary">
                Desteklenen formatlar: MP3, WAV, FLAC (En fazla 50MB)
              </Typography>
            </Box>
            
            {selectedFiles.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Seçilen Dosyalar ({selectedFiles.length})
                </Typography>
                
                <List dense>
                  {selectedFiles.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <AudioFileIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Çağrı Bilgileri
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="queue-label">Kuyruk</InputLabel>
                  <Select
                    labelId="queue-label"
                    name="queue"
                    value={formData.queue}
                    onChange={handleInputChange}
                    label="Kuyruk"
                    required
                  >
                    {queueOptions.map(queue => (
                      <MenuItem key={queue} value={queue}>
                        {queue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Temsilci Adı"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Çağrı Tarihi"
                  name="callDate"
                  type="datetime-local"
                  value={formData.callDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="direction-label">Çağrı Yönü</InputLabel>
                  <Select
                    labelId="direction-label"
                    name="isInbound"
                    value={formData.isInbound}
                    onChange={handleInputChange}
                    label="Çağrı Yönü"
                  >
                    <MenuItem value={true}>Gelen Çağrı</MenuItem>
                    <MenuItem value={false}>Giden Çağrı</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Özet
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Seçilen Dosyalar:</Typography>
                <Typography variant="body1">{selectedFiles.length} dosya</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Kuyruk:</Typography>
                <Typography variant="body1">{formData.queue || 'Belirtilmedi'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Temsilci:</Typography>
                <Typography variant="body1">{formData.agentName || 'Belirtilmedi'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Çağrı Tarihi:</Typography>
                <Typography variant="body1">
                  {formData.callDate 
                    ? new Date(formData.callDate).toLocaleString('tr-TR') 
                    : 'Belirtilmedi'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Çağrı Yönü:</Typography>
                <Typography variant="body1">
                  {formData.isInbound ? 'Gelen Çağrı' : 'Giden Çağrı'}
                </Typography>
              </Grid>
            </Grid>
            
            {uploadError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {uploadError}
              </Alert>
            )}
            
            {uploadSuccess && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Dosyalar başarıyla yüklendi!
              </Alert>
            )}
          </Box>
        );
      
      default:
        return 'Bilinmeyen adım';
    }
  };
  
  // Sonraki butonu için devre dışı bırakma koşulları
  const isNextDisabled = () => {
    if (activeStep === 0) {
      return selectedFiles.length === 0;
    }
    if (activeStep === 1) {
      return !formData.queue || !formData.agentName || !formData.callDate;
    }
    return false;
  };
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Yerel dosyaları oynatırken daha az hata olasılığı var, 
        // ancak yine de hata yakalama ekliyoruz
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(e => {
            console.error("Ses dosyası oynatılamadı:", e);
            setIsPlaying(false);
            alert("Ses dosyası oynatılamadı. Dosya bulunamıyor veya desteklenmeyen bir format olabilir.");
          });
        }
      }
    }
  };
  
  const handleSeek = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };
  
  const handleVolumeChange = (event, newValue) => {
    const newVolume = newValue / 100;
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };
  
  const handlePlaybackRateChange = (event) => {
    const rate = event.target.value;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };
  
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };
    
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('play', handlePlay);
    
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('play', handlePlay);
    };
  }, []);
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Çağrı Kaydı Yükleme
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {/* Adım göstergesi */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Adım içeriği */}
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        {/* Adım butonları */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || uploading}
          >
            Geri
          </Button>
          
          <Box>
            {uploadSuccess && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleReset}
                sx={{ mr: 1 }}
              >
                Yeni Yükleme
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isNextDisabled() || uploading}
              startIcon={activeStep === steps.length - 1 ? (
                uploading ? <CircularProgress size={20} /> : <UploadIcon />
              ) : null}
            >
              {activeStep === steps.length - 1 ? 'Yükle' : 'Devam'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Dosya silme onay diyaloğu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Dosyayı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu dosyayı silmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmRemoveFile} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dosya önizleme alanı */}
      {selectedFile && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Ses Dosyası Önizleme
          </Typography>
          
          <audio 
            ref={audioRef} 
            src={URL.createObjectURL(selectedFile)} 
            preload="auto"
            style={{ display: 'none' }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={skipBackward}>
              <FastRewindIcon />
            </IconButton>
            
            <IconButton 
              onClick={togglePlayPause} 
              sx={{ mx: 1 }}
            >
              {isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
            </IconButton>
            
            <IconButton onClick={skipForward}>
              <FastForwardIcon />
            </IconButton>
            
            <Typography variant="body2" sx={{ mx: 1, minWidth: '70px' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
            
            <Box sx={{ width: '100%', mx: 2 }}>
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={handleSeek}
                sx={{ color: 'primary.main' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '180px' }}>
              <IconButton onClick={toggleMute}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              
              <Slider
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                aria-label="Ses Seviyesi"
                sx={{ width: '80px', mx: 1 }}
              />
              
              <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                <Select
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  size="small"
                >
                  <MenuItem value={0.5}>0.5x</MenuItem>
                  <MenuItem value={1}>1x</MenuItem>
                  <MenuItem value={1.5}>1.5x</MenuItem>
                  <MenuItem value={2}>2x</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2">
              Dosya: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            
            <Button 
              color="secondary" 
              size="small"
              onClick={() => {
                setSelectedFile(null);
                setIsPlaying(false);
                setCurrentTime(0);
                setDuration(0);
              }}
            >
              Dosyayı Kaldır
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CallUpload; 
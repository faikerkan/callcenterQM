import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Slider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  GetApp as DownloadIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  Help as HelpIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  Print as PrintIcon
} from '@mui/icons-material';

// Redux entegrasyonu eklendi
import { fetchEvaluationById } from '../store/evaluationsSlice';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`evaluation-tabpanel-${index}`}
      aria-labelledby={`evaluation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EvaluationResults = () => {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  
  // Redux state'den veri alınıyor
  const { selectedEvaluation, loading, error } = useSelector(state => state.evaluations);
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Tab değişikliklerini işle
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Değerlendirme verilerini yükle
  useEffect(() => {
    console.log('Değerlendirme detayları yükleniyor, ID:', evaluationId);
    
    // Eğer evaluationId varsa ve selectedEvaluation yoksa veya farklı bir ID'ye sahipse
    if (evaluationId && (!selectedEvaluation || selectedEvaluation.id !== evaluationId)) {
      // Redux store'dan değerlendirme verilerini al
      dispatch(fetchEvaluationById(evaluationId))
        .unwrap()
        .then(result => {
          console.log('Değerlendirme detayları başarıyla yüklendi:', result);
        })
        .catch(error => {
          console.error('Değerlendirme detayları yüklenirken hata:', error);
        });
    } else {
      console.log('Mevcut değerlendirme verileri kullanılıyor:', selectedEvaluation);
    }
  }, [dispatch, evaluationId, selectedEvaluation]);
  
  // Audio URL değiştiğinde audio elementi yeniden yükle
  useEffect(() => {
    if (selectedEvaluation?.call?.audioUrl && audioRef.current) {
      // Audio URL'yi doğrulamak için bir fetch isteği gönder
      const checkAudioUrl = async () => {
        try {
          const response = await fetch(selectedEvaluation.call.audioUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.error("Ses dosyasına erişilemedi:", response.status);
            setAudioError(true);
            return;
          }
          
          // URL doğruysa audio elementini yükle
          audioRef.current.load();
          audioRef.current.volume = volume;
          audioRef.current.playbackRate = playbackRate;
          setAudioError(false);
        } catch (error) {
          console.error("Ses dosyası kontrol edilirken hata:", error);
          setAudioError(true);
        }
      };
      
      checkAudioUrl();
    }
  }, [selectedEvaluation?.call?.audioUrl, volume, playbackRate]);
  
  // Açık bir CORS hatası olabileceğinden, fallback URL'leri deneyelim
  const tryFallbackUrls = async () => {
    // CORS-friendly ses dosyası URL'leri
    const fallbackUrls = [];
    
    if (!audioRef.current) return;
    
    for (const url of fallbackUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          audioRef.current.src = url;
          audioRef.current.load();
          setAudioError(false);
          return true;
        }
      } catch (error) {
        console.error(`Yedek URL ${url} için erişim hatası:`, error);
      }
    }
    
    // Tüm URL'ler başarısız olursa
    return false;
  };
  
  // Ses dosyasının süresini ve şu anki zamanını izle
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };
    
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);
  
  const handleBack = () => {
    navigate('/evaluations');
  };
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(async (e) => {
          console.error("Ses dosyası oynatılamadı:", e);
          
          // Mevcut URL başarısız olduysa, yedek URL'leri deneyelim
          const fallbackSuccess = await tryFallbackUrls();
          if (fallbackSuccess) {
            audioRef.current.play().catch(err => {
              console.error("Yedek ses dosyası da oynatılamadı:", err);
              setAudioError(true);
              alert("Ses dosyası oynatılamadı. Dosya bulunamıyor veya desteklenmeyen bir format olabilir.");
            });
          } else {
            setAudioError(true);
            alert("Ses dosyası oynatılamadı. Dosya bulunamıyor veya desteklenmeyen bir format olabilir.");
          }
        });
        setIsPlaying(true);
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
  
  // Audio element'in durumunu dinle
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      const handlePause = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handleError = (e) => {
        console.error("Audio error:", e);
        setAudioError(true);
      };
      
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('error', handleError);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, []);
  
  const handleDownloadAudio = () => {
    // Gerçek uygulamada ses dosyasını indir
    if (selectedEvaluation?.call?.audioUrl) {
      // Dosyayı indirmek için bir link oluştur
      const link = document.createElement('a');
      link.href = selectedEvaluation.call.audioUrl;
      link.download = `call_${selectedEvaluation.call.id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('İndirilebilir ses dosyası bulunamadı.');
    }
  };
  
  const handlePrintEvaluation = () => {
    window.print();
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };
  
  const getScoreRating = (score) => {
    return score / 20; // 100 üzerinden puanı 5 üzerinden değere dönüştür
  };
  
  // Kriterlere göre filtrelenmiş ortalama hesapla
  const getAverage = (category) => {
    if (!selectedEvaluation?.criteria) return 0;
    
    const filteredCriteria = selectedEvaluation.criteria.filter(c => c.category === category);
    if (filteredCriteria.length === 0) return 0;
    
    let sum = 0;
    filteredCriteria.forEach(criterion => {
      sum += selectedEvaluation.scores[criterion.id] || 0;
    });
    
    return Math.round(sum / filteredCriteria.length);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }
  
  if (!selectedEvaluation) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Değerlendirme bulunamadı. Lütfen geçerli bir değerlendirme seçin.
      </Alert>
    );
  }
  
  return (
    <Box sx={{ mt: 4 }} className="evaluation-results-page">
      {/* Üst Başlık ve Butonlar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Geri
          </Button>
          <Typography variant="h4">
            Değerlendirme Formu
          </Typography>
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={handlePrintEvaluation}
            sx={{ ml: 1 }}
          >
            Yazdır
          </Button>
        </Box>
      </Box>
      
      {/* Özet Kartı */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Sol Taraf - Değerlendirilen Kişi ve Çağrı Bilgileri */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedEvaluation.call.agentName}</Typography>
                  <Typography variant="body2" color="text.secondary">Müşteri Temsilcisi</Typography>
                </Box>
              </Box>
              
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Typography>{selectedEvaluation.call.phoneNumber}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography>{new Date(selectedEvaluation.call.callDate).toLocaleString('tr-TR')}</Typography>
                    <Typography variant="body2" color="text.secondary">Süre: {selectedEvaluation.call.duration || '00:00:00'}</Typography>
                  </Box>
                </Box>
                
                <Chip 
                  label={selectedEvaluation.call.queue} 
                  color="info" 
                  variant="outlined" 
                  sx={{ width: 'fit-content' }} 
                />
              </Stack>
            </Grid>
            
            {/* Sağ Taraf - Değerlendirme Bilgileri */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%', bgcolor: 'background.default', position: 'relative', overflow: 'visible' }}>
                <CardContent>
                  <Box sx={{ position: 'absolute', top: -20, right: 16, bgcolor: getScoreColor(selectedEvaluation.totalScore), color: 'white', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {Math.round(selectedEvaluation.totalScore)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Değerlendirme Özeti
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Rating value={getScoreRating(selectedEvaluation.totalScore)} readOnly precision={0.5} sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      ({selectedEvaluation.totalScore}%)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Değerlendiren: {selectedEvaluation.evaluator.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tarih: {new Date(selectedEvaluation.createdAt).toLocaleString('tr-TR')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Ses Dosyası Oynatıcı */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Çağrı Kaydı
                </Typography>
                
                <audio 
                  ref={audioRef} 
                  src={selectedEvaluation.call.audioUrl} 
                  preload="auto"
                  style={{ display: 'none' }}
                />
                
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: audioError ? 'error.lightest' : 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton onClick={skipBackward} disabled={audioError}>
                      <FastRewindIcon />
                    </IconButton>
                    
                    <IconButton 
                      onClick={togglePlayPause} 
                      disabled={audioError}
                      sx={{ mx: 1 }}
                    >
                      {isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
                    </IconButton>
                    
                    <IconButton onClick={skipForward} disabled={audioError}>
                      <FastForwardIcon />
                    </IconButton>
                    
                    <Typography variant="body2" sx={{ mx: 1, minWidth: '80px' }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                    
                    <Box sx={{ width: '100%', mx: 2 }}>
                      <Slider
                        value={currentTime}
                        max={duration || 100}
                        onChange={handleSeek}
                        disabled={audioError}
                        sx={{ color: 'primary.main' }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '180px' }}>
                      <IconButton onClick={toggleMute} disabled={audioError}>
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                      </IconButton>
                      
                      <Slider
                        value={isMuted ? 0 : volume * 100}
                        onChange={handleVolumeChange}
                        aria-label="Ses Seviyesi"
                        disabled={audioError}
                        sx={{ width: '80px', mx: 1 }}
                      />
                      
                      <FormControl variant="standard" sx={{ minWidth: 80, ml: 1 }}>
                        <Select
                          value={playbackRate}
                          onChange={handlePlaybackRateChange}
                          disabled={audioError}
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
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadAudio}
                      disabled={audioError}
                      size="small"
                    >
                      Ses Kaydını İndir
                    </Button>
                  </Box>
                </Paper>
                
                {audioError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Ses dosyası yüklenemedi veya oynatılamadı. Lütfen sistem yöneticinize başvurun.
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Değerlendirme Detayları Tablar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Değerlendirme Kriterleri" icon={<StarIcon />} iconPosition="start" />
            <Tab label="Detaylı Puan Tablosu" icon={<ListItem />} iconPosition="start" />
            <Tab label="Yorumlar" icon={<CommentIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Değerlendirme Kriterleri Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {selectedEvaluation.criteria.map((criterion) => (
              <Grid item xs={12} key={criterion.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={7}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {criterion.name}
                        </Typography>
                        <Tooltip title={criterion.description}>
                          <HelpIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {criterion.description}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Ağırlık: %{criterion.weight}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={5}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Chip 
                          label={`${selectedEvaluation.scores[criterion.id]}%`} 
                          color={getScoreColor(selectedEvaluation.scores[criterion.id])}
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        />
                        <Rating 
                          value={getScoreRating(selectedEvaluation.scores[criterion.id])} 
                          readOnly 
                          precision={0.5} 
                        />
                      </Box>
                      <Box sx={{ mt: 1, width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedEvaluation.scores[criterion.id]} 
                          color={getScoreColor(selectedEvaluation.scores[criterion.id])}
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        {/* Detaylı Puan Tablosu Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kriter</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="center">Ağırlık</TableCell>
                  <TableCell align="center">Puan</TableCell>
                  <TableCell align="center">Değerlendirme</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedEvaluation.criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell component="th" scope="row">{criterion.name}</TableCell>
                    <TableCell>{criterion.description}</TableCell>
                    <TableCell align="center">%{criterion.weight}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${selectedEvaluation.scores[criterion.id]}%`} 
                        color={getScoreColor(selectedEvaluation.scores[criterion.id])}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Rating 
                        value={getScoreRating(selectedEvaluation.scores[criterion.id])} 
                        readOnly 
                        precision={0.5} 
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Toplam Puan: {selectedEvaluation.totalScore}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={selectedEvaluation.totalScore} 
              color={getScoreColor(selectedEvaluation.totalScore)}
              sx={{ height: 10, borderRadius: 5, mb: 1 }}
            />
          </Box>
        </TabPanel>
        
        {/* Yorumlar Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ mr: 1 }} /> Değerlendirme Yorumları
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, whiteSpace: 'pre-line' }}>
              {selectedEvaluation.comments || 'Bu değerlendirme için yorum yapılmamış.'}
            </Typography>
          </Paper>
          
          {selectedEvaluation.criticalErrors && Object.keys(selectedEvaluation.criticalErrors).length > 0 && (
            <Paper elevation={1} sx={{ p: 3, bgcolor: 'error.lightest', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Kritik Hatalar
              </Typography>
              
              <List>
                {Object.entries(selectedEvaluation.criticalErrors).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemIcon>
                      {value ? <FailIcon color="error" /> : <PassIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={key} 
                      secondary={value ? 'Kritik hata tespit edildi' : 'Kritik hata yok'} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default EvaluationResults; 
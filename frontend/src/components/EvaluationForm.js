import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Slider,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  TableContainer
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import trLocale from 'date-fns/locale/tr';
import { fetchCriteria } from '../store/criteriaSlice';
import { createEvaluation } from '../store/evaluationsSlice';
import { fetchEvaluations } from '../store/evaluationsSlice';
import { fetchQueues } from '../store/queuesSlice';
import { fetchUsers } from '../store/usersSlice';

const EvaluationForm = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  // Redux state
  const { criteria, loading: criteriaLoading } = useSelector(state => state.criteria);
  const { queues, loading: queuesLoading } = useSelector(state => state.queues);
  const { users, loading: usersLoading } = useSelector(state => state.users);
  
  // Local state
  const [formData, setFormData] = useState({
    callDate: new Date(),
    evaluationDate: new Date(),
    phoneNumber: '',
    queue: '',
    agentId: '',
    comments: '',
    audioFile: null
  });
  
  // Scores state
  const [scores, setScores] = useState({});
  
  // Critical errors state
  const [criticalErrors, setCriticalErrors] = useState({
    callTermination: false,       // Sürece uygun olmayan şekilde çağrıyı sonlandırdı (Çağrı Puanı 0)
    recordingError: false,        // Kayıt almadı, hatalı kayıt aldı (Çağrı Puanı 0)
    rudeBehavior: false,          // Azarlama, kaba ve ukala konuşma, bağırma (Çağrı Puanı 0)
    noContactInfo: false,         // İrtibat numarası almama/ güncellememe (Çağrı Puanı 0)
    lineLeftOpen: false,          // Müşteri kapattı ancak MT hattı açık bıraktı (Çağrı Puanı 0)
    kvkkViolation: false,         // KVKK Uyum  (Çağrı Puanı 0)
    indifferentBehavior: false,   // İlgisiz ve duyarsız davranış (Çağrı Puanı -%50 Düşer)
    interrupting: false,          // Söz kesme, aynı anda konuşma (Çağrı Puanı -%50 Düşer)
    improperGreeting: false,      // Çağrıyı geç ya da uygunsuz karşılama (gülme, esneme vs) (Çağrı Puanı -%50 Düşer)
    distracted: false,            // Görüşme esnasında farklı bir ekranla, içerikle ilgilenme (Çağrı Puanı -%50 Düşer)
    disturbingSounds: false,      // Yemek, sakız vb. nedenlerle çağrıya yanşayan sesler (Çağrı Puanı -%50 Düşer)
    personalInfoSharing: false,   // Kendi kişisel bilgilerini müşteri ile paylaşma (Çağrı Puanı -%50 Düşer)
    wrongProcedureInfo: false     // Şirket prosedür ve mevzuata aykırı bilgi paylaşma (Çağrı Puanı -%50 Düşer)
  });
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch criteria, queues and users on component mount
  useEffect(() => {
    dispatch(fetchCriteria());
    dispatch(fetchQueues());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Initialize scores when criteria are loaded
  useEffect(() => {
    if (criteria.length > 0) {
      const initialScores = {};
      criteria.forEach(criterion => {
        // Başlangıçta her kritere maksimum puanını ver
        initialScores[criterion.id] = criterion.maxScore;
      });
      setScores(initialScores);
    }
  }, [criteria]);
  
  // Calculate total score
  const calculateTotalScore = () => {
    if (!criteria.length) return 0;
    
    let totalScore = 0;
    criteria.forEach(criterion => {
      totalScore += scores[criterion.id] || 0;
    });
    
    // Apply critical error reductions
    if (hasCriticalErrorZero()) {
      return 0;
    } else if (hasCriticalErrorHalf()) {
      return totalScore * 0.5;
    }
    
    return totalScore;
  };
  
  // Check if any critical error that makes score 0 is selected
  const hasCriticalErrorZero = () => {
    return criticalErrors.callTermination || 
           criticalErrors.recordingError || 
           criticalErrors.rudeBehavior || 
           criticalErrors.noContactInfo || 
           criticalErrors.lineLeftOpen || 
           criticalErrors.kvkkViolation;
  };
  
  // Check if any critical error that reduces score by 50% is selected
  const hasCriticalErrorHalf = () => {
    return criticalErrors.indifferentBehavior || 
           criticalErrors.interrupting || 
           criticalErrors.improperGreeting || 
           criticalErrors.distracted || 
           criticalErrors.disturbingSounds || 
           criticalErrors.personalInfoSharing || 
           criticalErrors.wrongProcedureInfo;
  };
  
  // Handle score change for a criterion
  const handleScoreChange = (criterionId, newValue) => {
    setScores(prevScores => ({
      ...prevScores,
      [criterionId]: newValue
    }));
  };
  
  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleDateChange = (name, newDate) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: newDate
    }));
  };
  
  // Handle critical error change
  const handleCriticalErrorChange = (errorName) => {
    setCriticalErrors(prevErrors => ({
      ...prevErrors,
      [errorName]: !prevErrors[errorName]
    }));
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        audioFile: file
      }));
      
      // Create a URL for the audio file
      const audioUrl = URL.createObjectURL(file);
      setAudioSrc(audioUrl);
    }
  };
  
  // Toggle audio play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In a real app, you would control the audio element here
    const audioElement = document.getElementById('audio-player');
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.agentId) {
      setError('Lütfen bir müşteri temsilcisi seçin');
      return;
    }
    
    if (!formData.queue) {
      setError('Lütfen bir çağrı kuyruğu seçin');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Değerlendirme verilerini hazırla
      const evaluationData = {
        callId: callId || Math.floor(Math.random() * 1000).toString(), // Eğer callId yoksa random bir ID oluştur
        agentId: formData.agentId,
        queue: formData.queue,
        callDate: formData.callDate.toISOString(),
        evaluationDate: new Date().toISOString(),
        phoneNumber: formData.phoneNumber,
        scores: scores,
        criticalErrors: criticalErrors,
        comments: formData.comments,
        totalScore: calculateTotalScore(),
        evaluatorId: user.id
      };
      
      console.log('Gönderilen değerlendirme verileri:', evaluationData);
      
      // Redux action'ını dispatch et
      const resultAction = await dispatch(createEvaluation(evaluationData));
      
      // Eğer işlem başarılıysa
      if (createEvaluation.fulfilled.match(resultAction)) {
        console.log('Değerlendirme başarıyla kaydedildi:', resultAction.payload);
        setSuccess(true);
        
        // Başarılı kayıt sonrası formu sıfırla
        handleReset();
        
        // Değerlendirme listesini güncelle
        dispatch(fetchEvaluations())
          .unwrap()
          .then(result => {
            console.log('Değerlendirme listesi güncellendi:', result);
            
            // Başarılı kayıt mesajını göster ve değerlendirme listesine yönlendir
            setTimeout(() => {
              setSuccess(false);
              // Başarılı kayıt sonrası değerlendirme listesine yönlendir
              navigate('/evaluations');
            }, 2000);
          })
          .catch(error => {
            console.error('Değerlendirme listesi güncellenirken hata:', error);
          });
      } else {
        // Eğer bir hata varsa
        console.error('Değerlendirme kaydedilirken hata:', resultAction.error);
        setError(resultAction.payload || 'Değerlendirme kaydedilirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Değerlendirme kaydedilirken beklenmeyen hata:', err);
      setError('Değerlendirme kaydedilirken bir hata oluştu: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle form reset
  const handleReset = () => {
    // Reset scores
    const resetScores = {};
    criteria.forEach(criterion => {
      // Sıfırlarken puanları 0 yerine maksimum değerlerine ayarla
      resetScores[criterion.id] = criterion.maxScore;
    });
    setScores(resetScores);
    
    // Reset critical errors
    const resetErrors = {};
    Object.keys(criticalErrors).forEach(key => {
      resetErrors[key] = false;
    });
    setCriticalErrors(resetErrors);
    
    // Reset form data
    setFormData({
      callDate: new Date(),
      evaluationDate: new Date(),
      phoneNumber: '',
      queue: '',
      agentId: '',
      comments: '',
      audioFile: null
    });
    
    // Reset audio
    setAudioSrc('');
    setIsPlaying(false);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Get score color based on percentage
  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'info';
    if (percentage >= 40) return 'warning';
    return 'error';
  };
  
  if (criteriaLoading || queuesLoading || usersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2, 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 9999,
            boxShadow: 3,
            minWidth: '300px'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Başarılı!
          </Typography>
          <Typography variant="body2">
            Değerlendirme başarıyla kaydedildi!
          </Typography>
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Çağrı Değerlendirme Formu
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Müşteri Temsilcisi Seçimi */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="agent-select-label">Müşteri Temsilcisi</InputLabel>
              <Select
                labelId="agent-select-label"
                id="agent-select"
                name="agentId"
                value={formData.agentId}
                onChange={handleInputChange}
                label="Müşteri Temsilcisi"
                required
              >
                {users && users.filter(user => user.role === 'agent' || user.role === 'expert').map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.firstName} {agent.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Çağrı Kuyruğu */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="queue-select-label">Çağrı Kuyruğu</InputLabel>
              <Select
                labelId="queue-select-label"
                id="queue-select"
                name="queue"
                value={formData.queue}
                onChange={handleInputChange}
                label="Çağrı Kuyruğu"
                required
              >
                {queues && queues.map(queue => (
                  <MenuItem key={queue.id} value={queue.id}>
                    {queue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Çağrı Tarihi */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
              <DateTimePicker
                label="Çağrı Tarihi"
                value={formData.callDate}
                onChange={(newDate) => handleDateChange('callDate', newDate)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Telefon Numarası */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefon Numarası"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+90 555 123 4567"
              required
            />
          </Grid>
          
          {/* Ses Dosyası Yükleme */}
          <Grid item xs={12}>
            <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
              <input
                accept="audio/*"
                style={{ display: 'none' }}
                id="audio-file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="audio-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Çağrı Ses Dosyası Yükle
                </Button>
              </label>
              
              {formData.audioFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {formData.audioFile.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton onClick={togglePlayPause} color="primary">
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                    <audio id="audio-player" src={audioSrc} style={{ display: 'none' }} />
                    <Typography variant="body2" color="textSecondary">
                      {isPlaying ? 'Durdur' : 'Oynat'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Değerlendirme Kriterleri */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            Değerlendirme Kriterleri
          </Typography>
          
          <Chip 
            label={`Toplam Puan: ${calculateTotalScore()} / 100`} 
            color={getScoreColor(calculateTotalScore(), 100)}
            size="medium"
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <TableContainer component={Paper} variant="outlined">
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead" sx={{ backgroundColor: '#f5f5f5' }}>
              <Box component="tr">
                <Box component="th" sx={{ p: 2, textAlign: 'left', width: '40%' }}>Kriter</Box>
                <Box component="th" sx={{ p: 2, textAlign: 'left', width: '40%' }}>Puanlama</Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center', width: '20%' }}>Puan</Box>
              </Box>
            </Box>
            
            <Box component="tbody">
              {criteria.map(criterion => (
                <Box component="tr" key={criterion.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                  <Box component="td" sx={{ p: 2 }}>
                    <Typography variant="body1">{criterion.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{criterion.description}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2 }}>
                    <Slider
                      value={scores[criterion.id] || 0}
                      onChange={(_, newValue) => handleScoreChange(criterion.id, newValue)}
                      step={1}
                      min={0}
                      max={criterion.maxScore}
                      valueLabelDisplay="auto"
                      sx={{ width: '90%' }}
                    />
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Chip 
                      label={`${scores[criterion.id] || 0} / ${criterion.maxScore}`} 
                      color={getScoreColor(scores[criterion.id] || 0, criterion.maxScore)}
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </TableContainer>
      </Paper>
      
      {/* Kritik Hatalar */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Kritik Hatalar
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          Aşağıdaki kritik hatalardan herhangi biri işaretlenirse, değerlendirme puanı etkilenecektir.
        </Alert>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="error" gutterBottom>
              Puanı Sıfırlayan Hatalar:
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.callTermination}
                  onChange={() => handleCriticalErrorChange('callTermination')}
                  color="error"
                />
              }
              label="Sürece uygun olmayan şekilde çağrıyı sonlandırdı"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.recordingError}
                  onChange={() => handleCriticalErrorChange('recordingError')}
                  color="error"
                />
              }
              label="Kayıt almadı, hatalı kayıt aldı"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.rudeBehavior}
                  onChange={() => handleCriticalErrorChange('rudeBehavior')}
                  color="error"
                />
              }
              label="Azarlama, kaba ve ukala konuşma, bağırma"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.noContactInfo}
                  onChange={() => handleCriticalErrorChange('noContactInfo')}
                  color="error"
                />
              }
              label="İrtibat numarası almama/ güncellememe"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.lineLeftOpen}
                  onChange={() => handleCriticalErrorChange('lineLeftOpen')}
                  color="error"
                />
              }
              label="Müşteri kapattı ancak MT hattı açık bıraktı"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.kvkkViolation}
                  onChange={() => handleCriticalErrorChange('kvkkViolation')}
                  color="error"
                />
              }
              label="KVKK Uyum"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="warning.main" gutterBottom sx={{ mt: 2 }}>
              Puanı %50 Düşüren Hatalar:
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.indifferentBehavior}
                  onChange={() => handleCriticalErrorChange('indifferentBehavior')}
                  color="warning"
                />
              }
              label="İlgisiz ve duyarsız davranış"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.interrupting}
                  onChange={() => handleCriticalErrorChange('interrupting')}
                  color="warning"
                />
              }
              label="Söz kesme, aynı anda konuşma"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.improperGreeting}
                  onChange={() => handleCriticalErrorChange('improperGreeting')}
                  color="warning"
                />
              }
              label="Çağrıyı geç ya da uygunsuz karşılama (gülme, esneme vs)"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.distracted}
                  onChange={() => handleCriticalErrorChange('distracted')}
                  color="warning"
                />
              }
              label="Görüşme esnasında farklı bir ekranla, içerikle ilgilenme"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.disturbingSounds}
                  onChange={() => handleCriticalErrorChange('disturbingSounds')}
                  color="warning"
                />
              }
              label="Yemek, sakız vb. nedenlerle çağrıya yanşayan sesler"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.personalInfoSharing}
                  onChange={() => handleCriticalErrorChange('personalInfoSharing')}
                  color="warning"
                />
              }
              label="Kendi kişisel bilgilerini müşteri ile paylaşma"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={criticalErrors.wrongProcedureInfo}
                  onChange={() => handleCriticalErrorChange('wrongProcedureInfo')}
                  color="warning"
                />
              }
              label="Şirket prosedür ve mevzuata aykırı bilgi paylaşma"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Açıklama */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Değerlendirme Açıklaması
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          name="comments"
          value={formData.comments}
          onChange={handleInputChange}
          placeholder="Değerlendirme ile ilgili açıklamalarınızı buraya yazabilirsiniz..."
        />
      </Paper>
      
      {/* Form Butonları */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
          disabled={submitting}
        >
          İptal
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          disabled={submitting}
        >
          Temizle
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Kaydet'}
        </Button>
      </Box>
    </Box>
  );
};

export default EvaluationForm; 
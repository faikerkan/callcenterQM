import React, { useEffect, useState } from 'react';
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
  Rating
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

// Not: Redux entegrasyonu henüz yapılmadı
// import { fetchEvaluationById } from '../store/evaluationsSlice';

const EvaluationResults = () => {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Gerçek uygulamada Redux state'den veri alınacak
  // const { selectedEvaluation, loading, error } = useSelector(state => state.evaluations);
  
  // Mock veriler
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation] = useState({
    id: evaluationId,
    call: {
      id: 123,
      agentName: 'Ahmet Yılmaz',
      callDate: '2023-08-10T14:30:00',
      phoneNumber: '+90 555 123 4567',
      duration: '00:05:30',
      queue: 'Destek',
      audioUrl: 'https://example.com/audio.mp3'
    },
    evaluator: {
      id: 456,
      name: 'Mehmet Uzman'
    },
    scores: {
      1: 80, // Müşteri Selamlama
      2: 70, // Problem Anlama
      3: 90, // Çözüm Sunma
      4: 85, // İletişim Becerileri
      5: 75  // Kapanış
    },
    criteria: [
      { id: 1, name: 'Müşteri Selamlama', description: 'Müşteri uygun şekilde karşılandı mı?', weight: 10 },
      { id: 2, name: 'Problem Anlama', description: 'Temsilci müşterinin sorununu doğru şekilde anladı mı?', weight: 20 },
      { id: 3, name: 'Çözüm Sunma', description: 'Temsilci uygun ve etkili bir çözüm sundu mu?', weight: 30 },
      { id: 4, name: 'İletişim Becerileri', description: 'Temsilcinin genel iletişim becerileri nasıldı?', weight: 25 },
      { id: 5, name: 'Kapanış', description: 'Görüşme uygun şekilde sonlandırıldı mı?', weight: 15 }
    ],
    totalScore: 81.5,
    comments: 'Temsilci genel olarak iyi bir performans sergiledi. Müşterinin sorunu başarılı bir şekilde çözüldü ve müşteri memnun ayrıldı.',
    improvementAreas: 'Müşterinin sorununu anlamak için daha fazla açık uçlu soru sorabilir. Bazı teknik terimleri müşteriye açıklarken daha basit ifadeler kullanabilir.',
    createdAt: '2023-08-11T09:45:00'
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Gerçek uygulamada değerlendirme verilerini yükle
  /*
  useEffect(() => {
    dispatch(fetchEvaluationById(evaluationId));
  }, [dispatch, evaluationId]);
  */
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Gerçek uygulamada ses dosyasını oynat/duraklat
  };
  
  const handleDownloadAudio = () => {
    // Gerçek uygulamada ses dosyasını indir
    alert('Ses dosyası indiriliyor...');
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };
  
  const getScoreRating = (score) => {
    return Math.round(score / 20); // 0-100 aralığını 0-5 aralığına dönüştür
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
  
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Geri
        </Button>
        <Typography variant="h4">
          Değerlendirme Sonuçları
        </Typography>
      </Box>
      
      {/* Özet Kartı */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Temsilci:</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{evaluation.call.agentName}</Typography>
              
              <Typography variant="subtitle1">Telefon:</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{evaluation.call.phoneNumber}</Typography>
              
              <Typography variant="subtitle1">Çağrı Tarihi:</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {new Date(evaluation.call.callDate).toLocaleString('tr-TR')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Değerlendiren:</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{evaluation.evaluator.name}</Typography>
              
              <Typography variant="subtitle1">Değerlendirme Tarihi:</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {new Date(evaluation.createdAt).toLocaleString('tr-TR')}
              </Typography>
              
              <Typography variant="subtitle1">Toplam Puan:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={`${evaluation.totalScore}%`} 
                  color={getScoreColor(evaluation.totalScore)}
                  sx={{ fontWeight: 'bold', mr: 1 }}
                />
                <Rating value={getScoreRating(evaluation.totalScore)} readOnly precision={0.5} />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? 'Duraklat' : 'Çağrıyı Dinle'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadAudio}
                >
                  Ses Kaydını İndir
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Değerlendirme Kriterleri */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Sonuçları
        </Typography>
        
        <List>
          {evaluation.criteria.map((criterion) => (
            <React.Fragment key={criterion.id}>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <ListItemText
                      primary={`${criterion.name} (${criterion.weight}%)`}
                      secondary={criterion.description}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Rating 
                      value={getScoreRating(evaluation.scores[criterion.id])} 
                      readOnly 
                      precision={0.5} 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={`${evaluation.scores[criterion.id]}%`} 
                      color={getScoreColor(evaluation.scores[criterion.id])}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      
      {/* Yorumlar ve Gelişim Alanları */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Yorumları
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Yorumlar:
          </Typography>
          <Typography variant="body1" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            {evaluation.comments || 'Yorum yapılmamış.'}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Gelişim Alanları:
          </Typography>
          <Typography variant="body1" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            {evaluation.improvementAreas || 'Gelişim alanı belirtilmemiş.'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EvaluationResults; 
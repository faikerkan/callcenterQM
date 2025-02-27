import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCallById } from '../store/callsSlice';
import { createEvaluation } from '../store/evaluationsSlice';
import { fetchCriteria } from '../store/criteriaSlice';

const EvaluationForm = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCall, loading: callLoading } = useSelector((state) => state.calls);
  const { criteria, loading: criteriaLoading, error: criteriaError } = useSelector((state) => state.criteria);
  const { loading: evalLoading, error: evalError } = useSelector((state) => state.evaluations);
  
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState('');
  const [improvementAreas, setImprovementAreas] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCallById(callId));
    dispatch(fetchCriteria());
  }, [dispatch, callId]);

  useEffect(() => {
    if (criteria.length > 0) {
      // Initialize scores with 0 for each criteria
      const initialScores = {};
      criteria.forEach(criterion => {
        initialScores[criterion.id] = 0;
      });
      setScores(initialScores);
    }
  }, [criteria]);

  useEffect(() => {
    if (Object.keys(scores).length > 0 && criteria.length > 0) {
      // Calculate weighted average score
      let weightedSum = 0;
      let totalWeight = 0;
      
      criteria.forEach(criterion => {
        weightedSum += (scores[criterion.id] * criterion.weight);
        totalWeight += criterion.weight;
      });
      
      const calculatedTotal = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      setTotalScore(parseFloat(calculatedTotal.toFixed(2)));
    }
  }, [scores, criteria]);

  const handleScoreChange = (criterionId, newValue) => {
    setScores({
      ...scores,
      [criterionId]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await dispatch(createEvaluation({
        call: callId,
        scores,
        total_score: totalScore,
        comments,
        improvement_areas: improvementAreas
      })).unwrap();
      
      navigate('/evaluations');
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (callLoading || criteriaLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const error = criteriaError || evalError;
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!selectedCall) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Çağrı bulunamadı.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Çağrı Değerlendirme Formu
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Müşteri Temsilcisi
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedCall.agent_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Çağrı Tarihi
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(selectedCall.call_date).toLocaleString('tr-TR')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Telefon Numarası
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedCall.phone_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Çağrı Süresi
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedCall.duration}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Kriterleri
        </Typography>
        
        {criteria.length > 0 ? (
          criteria.map((criterion) => (
            <Box key={criterion.id} sx={{ mb: 3 }}>
              <Typography id={`criterion-${criterion.id}-label`} gutterBottom>
                {criterion.name} ({criterion.weight}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {criterion.description}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={scores[criterion.id] || 0}
                    onChange={(_, newValue) => handleScoreChange(criterion.id, newValue)}
                    aria-labelledby={`criterion-${criterion.id}-label`}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {scores[criterion.id] || 0}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        ) : (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            Henüz değerlendirme kriteri eklenmemiş. Lütfen önce değerlendirme kriterleri ekleyin.
          </Alert>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Toplam Puan:
          </Typography>
          <Typography variant="h5" color={totalScore >= 70 ? 'success.main' : totalScore >= 50 ? 'warning.main' : 'error.main'}>
            {totalScore}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Notları
        </Typography>
        
        <TextField
          fullWidth
          label="Yorumlar"
          multiline
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Gelişim Alanları"
          multiline
          rows={4}
          value={improvementAreas}
          onChange={(e) => setImprovementAreas(e.target.value)}
          margin="normal"
        />
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/calls')}
          disabled={submitting}
        >
          İptal
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting || criteria.length === 0}
        >
          {submitting ? <CircularProgress size={24} /> : 'Değerlendirmeyi Kaydet'}
        </Button>
      </Box>
    </Box>
  );
};

export default EvaluationForm; 
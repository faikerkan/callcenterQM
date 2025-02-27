import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEvaluationById } from '../store/evaluationsSlice';
import { fetchCallById } from '../store/callsSlice';
import { fetchCriteria } from '../store/criteriaSlice';

const EvaluationResults = () => {
  const { evaluationId } = useParams();
  const dispatch = useDispatch();
  const { selectedEvaluation, loading: evalLoading, error: evalError } = useSelector((state) => state.evaluations);
  const { selectedCall, loading: callLoading, error: callError } = useSelector((state) => state.calls);
  const { criteria, loading: criteriaLoading, error: criteriaError } = useSelector((state) => state.criteria);

  useEffect(() => {
    if (evaluationId) {
      dispatch(fetchEvaluationById(evaluationId));
      dispatch(fetchCriteria());
    }
  }, [dispatch, evaluationId]);

  useEffect(() => {
    if (selectedEvaluation?.call) {
      dispatch(fetchCallById(selectedEvaluation.call));
    }
  }, [dispatch, selectedEvaluation]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  if (evalLoading || callLoading || criteriaLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const error = evalError || callError || criteriaError;
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
        Değerlendirme bulunamadı.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Değerlendirme Sonuçları
        </Typography>
        <Chip 
          label={`Toplam Puan: ${selectedEvaluation.total_score}`} 
          color={getScoreColor(selectedEvaluation.total_score)}
          variant="outlined"
          sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, px: 1 }}
        />
      </Box>
      
      {selectedCall && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Çağrı Bilgileri
            </Typography>
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
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Kriterleri
        </Typography>
        
        {criteria.length > 0 ? (
          criteria.map((criterion) => {
            const score = selectedEvaluation.scores[criterion.id] || 0;
            return (
              <Box key={criterion.id} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      {criterion.name} ({criterion.weight}%)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {criterion.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={score} 
                          color={getScoreColor(score)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {score}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })
        ) : (
          <Alert severity="info">
            Değerlendirme kriterleri bulunamadı.
          </Alert>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Notları
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Yorumlar
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedEvaluation.comments || 'Yorum bulunmamaktadır.'}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Gelişim Alanları
          </Typography>
          <Typography variant="body1">
            {selectedEvaluation.improvement_areas || 'Gelişim alanı belirtilmemiştir.'}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Değerlendirme Bilgileri
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Değerlendirme Tarihi
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(selectedEvaluation.created_at).toLocaleString('tr-TR')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Değerlendiren
            </Typography>
            <Typography variant="body1" gutterBottom>
              {selectedEvaluation.evaluator_name || 'Belirtilmemiş'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EvaluationResults; 
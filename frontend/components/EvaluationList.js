import React, { useEffect, useState } from 'react';
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
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvaluations } from '../store/evaluationsSlice';
import { useNavigate } from 'react-router-dom';

const EvaluationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { evaluations, loading, error } = useSelector((state) => state.evaluations);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);

  useEffect(() => {
    if (evaluations) {
      setFilteredEvaluations(
        evaluations.filter((evaluation) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            evaluation.call_details?.agent_name.toLowerCase().includes(searchLower) ||
            evaluation.evaluator_name.toLowerCase().includes(searchLower) ||
            evaluation.call_details?.phone_number.includes(searchTerm)
          );
        })
      );
    }
  }, [evaluations, searchTerm]);

  const handleViewEvaluation = (evaluationId) => {
    navigate(`/evaluations/${evaluationId}`);
  };

  const handleEditEvaluation = (evaluationId) => {
    navigate(`/evaluations/edit/${evaluationId}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Değerlendirmeler
        </Typography>
        
        <TextField
          size="small"
          variant="outlined"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FilterList />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="değerlendirme listesi">
          <TableHead>
            <TableRow>
              <TableCell>Müşteri Temsilcisi</TableCell>
              <TableCell>Çağrı Tarihi</TableCell>
              <TableCell>Değerlendiren</TableCell>
              <TableCell>Değerlendirme Tarihi</TableCell>
              <TableCell>Puan</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.call_details?.agent_name || 'Belirtilmemiş'}</TableCell>
                  <TableCell>
                    {evaluation.call_details?.call_date
                      ? new Date(evaluation.call_details.call_date).toLocaleString('tr-TR')
                      : 'Belirtilmemiş'}
                  </TableCell>
                  <TableCell>{evaluation.evaluator_name}</TableCell>
                  <TableCell>{new Date(evaluation.created_at).toLocaleString('tr-TR')}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${evaluation.total_score}%`}
                      color={getScoreColor(evaluation.total_score)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewEvaluation(evaluation.id)}
                      sx={{ mr: 1 }}
                    >
                      Görüntüle
                    </Button>
                    
                    {user?.role === 'expert' && (
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditEvaluation(evaluation.id)}
                      >
                        Düzenle
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchTerm
                    ? 'Arama kriterlerine uygun değerlendirme bulunamadı.'
                    : 'Henüz değerlendirme bulunmuyor.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EvaluationList; 
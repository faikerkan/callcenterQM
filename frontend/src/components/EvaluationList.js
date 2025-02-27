import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

// Not: Redux entegrasyonu henüz yapılmadı
// import { fetchEvaluations } from '../store/evaluationsSlice';

const EvaluationList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Gerçek uygulamada Redux store'dan verileri çekeceğiz
  // const { evaluations, loading, error } = useSelector(state => state.evaluations);
  
  // Mock veriler
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluations] = useState([
    {
      id: '1',
      call: {
        id: '101',
        agentName: 'Ahmet Yılmaz',
        phoneNumber: '+90 555 123 4567',
        callDate: '2023-08-10T14:30:00',
        duration: '00:05:30',
        queue: 'Destek'
      },
      evaluator: {
        id: '201',
        name: 'Mehmet Uzman'
      },
      totalScore: 81.5,
      createdAt: '2023-08-11T09:45:00'
    },
    {
      id: '2',
      call: {
        id: '102',
        agentName: 'Ayşe Demir',
        phoneNumber: '+90 555 789 1234',
        callDate: '2023-08-10T10:15:00',
        duration: '00:12:45',
        queue: 'Satış'
      },
      evaluator: {
        id: '202',
        name: 'Zeynep Kalite'
      },
      totalScore: 92.0,
      createdAt: '2023-08-11T11:30:00'
    },
    {
      id: '3',
      call: {
        id: '103',
        agentName: 'Mustafa Kaya',
        phoneNumber: '+90 555 456 7890',
        callDate: '2023-08-09T16:20:00',
        duration: '00:08:15',
        queue: 'Teknik Destek'
      },
      evaluator: {
        id: '203',
        name: 'Ali Denetçi'
      },
      totalScore: 68.5,
      createdAt: '2023-08-10T14:25:00'
    },
    {
      id: '4',
      call: {
        id: '104',
        agentName: 'Fatma Şahin',
        phoneNumber: '+90 555 234 5678',
        callDate: '2023-08-09T11:10:00',
        duration: '00:15:20',
        queue: 'Müşteri Hizmetleri'
      },
      evaluator: {
        id: '204',
        name: 'Mehmet Uzman'
      },
      totalScore: 75.0,
      createdAt: '2023-08-10T09:15:00'
    },
    {
      id: '5',
      call: {
        id: '105',
        agentName: 'Emre Yıldırım',
        phoneNumber: '+90 555 345 6789',
        callDate: '2023-08-08T09:30:00',
        duration: '00:04:50',
        queue: 'Satış'
      },
      evaluator: {
        id: '205',
        name: 'Zeynep Kalite'
      },
      totalScore: 88.5,
      createdAt: '2023-08-09T10:45:00'
    }
  ]);
  
  // Arama, filtreleme ve sayfalama için state'ler
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQueue, setFilterQueue] = useState('');
  const [filterEvaluator, setFilterEvaluator] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Gerçek uygulamada değerlendirmeleri yükle
  /*
  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);
  */
  
  // Arama terimine ve filtrelere göre değerlendirmeleri filtrele
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearchTerm = 
      evaluation.call.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.call.phoneNumber.includes(searchTerm);
    
    const matchesQueueFilter = filterQueue === '' || evaluation.call.queue === filterQueue;
    const matchesEvaluatorFilter = filterEvaluator === '' || evaluation.evaluator.name === filterEvaluator;
    
    return matchesSearchTerm && matchesQueueFilter && matchesEvaluatorFilter;
  });
  
  // Eşsiz kuyruk ve değerlendirici filtre seçeneklerini oluştur
  const queueOptions = [...new Set(evaluations.map(e => e.call.queue))];
  const evaluatorOptions = [...new Set(evaluations.map(e => e.evaluator.name))];
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleQueueFilterChange = (event) => {
    setFilterQueue(event.target.value);
    setPage(0);
  };
  
  const handleEvaluatorFilterChange = (event) => {
    setFilterEvaluator(event.target.value);
    setPage(0);
  };
  
  const handleViewEvaluation = (evaluationId) => {
    navigate(`/evaluations/${evaluationId}`);
  };
  
  const handleDownloadReport = (evaluationId) => {
    // Gerçek uygulamada değerlendirme raporunu indir
    alert(`Değerlendirme raporu indiriliyor: ${evaluationId}`);
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
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
      <Typography variant="h4" gutterBottom>
        Değerlendirme Listesi
      </Typography>
      
      {/* Arama ve Filtreler */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Temsilci Adı veya Telefon"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel id="queue-filter-label">Kuyruk</InputLabel>
            <Select
              labelId="queue-filter-label"
              value={filterQueue}
              onChange={handleQueueFilterChange}
              label="Kuyruk"
              displayEmpty
            >
              <MenuItem value="">
                <em>Tümü</em>
              </MenuItem>
              {queueOptions.map(queue => (
                <MenuItem key={queue} value={queue}>
                  {queue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="evaluator-filter-label">Değerlendiren</InputLabel>
            <Select
              labelId="evaluator-filter-label"
              value={filterEvaluator}
              onChange={handleEvaluatorFilterChange}
              label="Değerlendiren"
              displayEmpty
            >
              <MenuItem value="">
                <em>Tümü</em>
              </MenuItem>
              {evaluatorOptions.map(evaluator => (
                <MenuItem key={evaluator} value={evaluator}>
                  {evaluator}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Değerlendirme Tablosu */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Temsilci</TableCell>
                <TableCell>Kuyruk</TableCell>
                <TableCell>Çağrı Tarihi</TableCell>
                <TableCell>Değerlendiren</TableCell>
                <TableCell>Değerlendirme Tarihi</TableCell>
                <TableCell align="center">Puan</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvaluations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((evaluation) => (
                  <TableRow key={evaluation.id} hover>
                    <TableCell>{evaluation.call.agentName}</TableCell>
                    <TableCell>{evaluation.call.queue}</TableCell>
                    <TableCell>
                      {new Date(evaluation.call.callDate).toLocaleString('tr-TR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </TableCell>
                    <TableCell>{evaluation.evaluator.name}</TableCell>
                    <TableCell>
                      {new Date(evaluation.createdAt).toLocaleString('tr-TR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${evaluation.totalScore}%`} 
                        color={getScoreColor(evaluation.totalScore)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleViewEvaluation(evaluation.id)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          onClick={() => handleDownloadReport(evaluation.id)}
                          size="small"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
              ))}
              
              {filteredEvaluations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="subtitle1" sx={{ py: 2 }}>
                      Arama kriterlerine uygun değerlendirme bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvaluations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default EvaluationList; 
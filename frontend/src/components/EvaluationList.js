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
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

// Redux entegrasyonu
import { fetchEvaluations } from '../store/evaluationsSlice';

const EvaluationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { evaluations, loading, error } = useSelector(state => state.evaluations);
  const { user } = useSelector(state => state.auth);
  
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQueue, setFilterQueue] = useState('');
  const [filterEvaluator, setFilterEvaluator] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    console.log('EvaluationList bileşeni yükleniyor...');
    
    // Değerlendirmeleri yükle
    dispatch(fetchEvaluations())
      .unwrap()
      .then(result => {
        console.log('Değerlendirmeler başarıyla yüklendi:', result);
        console.log('Değerlendirme sayısı:', result.length);
      })
      .catch(error => {
        console.error('Değerlendirmeler yüklenirken hata:', error);
      });
  }, [dispatch]);
  
  useEffect(() => {
    console.log('Filtreleme için değerlendirmeler:', evaluations);
    
    if (!evaluations || !Array.isArray(evaluations)) {
      console.log('Değerlendirmeler henüz yüklenmedi veya geçerli bir dizi değil');
      setFilteredEvaluations([]);
      return;
    }
    
    console.log('Toplam değerlendirme sayısı:', evaluations.length);
    
    // Kullanıcı rolüne göre filtreleme
    let filtered = [...evaluations];
    
    // Eğer kullanıcı agent ise, sadece kendi değerlendirmelerini göster
    if (user && user.role === 'agent') {
      filtered = filtered.filter(evaluation => 
        evaluation.call && 
        evaluation.call.agentId && 
        evaluation.call.agentId === user.id
      );
    }
    
    // Arama terimine göre filtreleme
    if (searchTerm) {
      filtered = filtered.filter(evaluation => {
        const agentName = evaluation.call && evaluation.call.agentName ? evaluation.call.agentName.toLowerCase() : '';
        const phoneNumber = evaluation.call && evaluation.call.phoneNumber ? evaluation.call.phoneNumber.toLowerCase() : '';
        const searchLower = searchTerm.toLowerCase();
        
        return agentName.includes(searchLower) || phoneNumber.includes(searchLower);
      });
    }
    
    // Kuyruğa göre filtreleme
    if (filterQueue) {
      filtered = filtered.filter(evaluation => 
        evaluation.call && 
        evaluation.call.queue && 
        evaluation.call.queue === filterQueue
      );
    }
    
    // Değerlendiriciye göre filtreleme
    if (filterEvaluator) {
      filtered = filtered.filter(evaluation => 
        evaluation.evaluator && 
        evaluation.evaluator.name && 
        evaluation.evaluator.name === filterEvaluator
      );
    }
    
    console.log('Filtreleme sonrası değerlendirme sayısı:', filtered.length);
    setFilteredEvaluations(filtered);
  }, [evaluations, searchTerm, filterQueue, filterEvaluator, user]);
  
  // Eşsiz kuyruk ve değerlendirici filtre seçeneklerini oluştur
  const queueOptions = evaluations && Array.isArray(evaluations) ? [...new Set(evaluations.filter(e => e.call && e.call.queue).map(e => e.call.queue))] : [];
  const evaluatorOptions = evaluations && Array.isArray(evaluations) ? [...new Set(evaluations.filter(e => e.evaluator && e.evaluator.name).map(e => e.evaluator.name))] : [];
  
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
    console.log('Görüntülenen değerlendirme ID:', evaluationId);
    
    // Değerlendirme ID'sini kontrol et
    const evaluation = filteredEvaluations.find(e => e.id === evaluationId);
    if (!evaluation) {
      console.error('Değerlendirme bulunamadı:', evaluationId);
      alert('Değerlendirme detayları yüklenirken bir hata oluştu.');
      return;
    }
    
    console.log('Görüntülenecek değerlendirme:', evaluation);
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
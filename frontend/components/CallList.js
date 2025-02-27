import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  PlayArrow, 
  Assessment, 
  Search,
  FilterList
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalls } from '../store/callsSlice';
import { useNavigate } from 'react-router-dom';

const CallList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { calls, loading, error } = useSelector((state) => state.calls);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCalls, setFilteredCalls] = useState([]);

  useEffect(() => {
    dispatch(fetchCalls());
  }, [dispatch]);

  useEffect(() => {
    if (calls) {
      setFilteredCalls(
        calls.filter((call) => 
          call.phone_number.includes(searchTerm) || 
          call.agent_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [calls, searchTerm]);

  const handleEvaluate = (callId) => {
    navigate(`/evaluations/new/${callId}`);
  };

  const handleViewEvaluation = (callId) => {
    navigate(`/evaluations/${callId}`);
  };

  const getStatusChip = (status) => {
    let color = 'default';
    let label = status;

    switch (status) {
      case 'pending':
        color = 'warning';
        label = 'Değerlendirilecek';
        break;
      case 'in_progress':
        color = 'info';
        label = 'Değerlendiriliyor';
        break;
      case 'completed':
        color = 'success';
        label = 'Tamamlandı';
        break;
      default:
        break;
    }

    return <Chip size="small" color={color} label={label} />;
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
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Hata: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Çağrı Kayıtları
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
        <Table sx={{ minWidth: 650 }} aria-label="çağrı listesi">
          <TableHead>
            <TableRow>
              <TableCell>Temsilci</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Süre</TableCell>
              <TableCell>Kuyruk</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCalls.length > 0 ? (
              filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.agent_name}</TableCell>
                  <TableCell>{new Date(call.call_date).toLocaleString('tr-TR')}</TableCell>
                  <TableCell>{call.phone_number}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>{call.queue}</TableCell>
                  <TableCell>{getStatusChip(call.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" title="Çağrıyı Dinle">
                      <PlayArrow />
                    </IconButton>
                    
                    {user?.role === 'expert' && call.status === 'pending' && (
                      <Button 
                        size="small" 
                        startIcon={<Assessment />}
                        onClick={() => handleEvaluate(call.id)}
                        sx={{ ml: 1 }}
                      >
                        Değerlendir
                      </Button>
                    )}
                    
                    {call.status === 'completed' && (
                      <Button 
                        size="small" 
                        startIcon={<Assessment />}
                        onClick={() => handleViewEvaluation(call.id)}
                        sx={{ ml: 1 }}
                      >
                        Sonuç
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm ? 'Arama kriterlerine uygun çağrı bulunamadı.' : 'Henüz çağrı kaydı bulunmuyor.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CallList; 
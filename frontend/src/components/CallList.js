import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const CallList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Örnek veri - Gerçek uygulamada API'den gelecek
  const calls = [
    {
      id: 1,
      agent_name: 'Ahmet Yılmaz',
      call_date: '2023-06-01T14:30:00',
      phone_number: '+905551112233',
      duration: '00:05:30',
      queue: 'Destek',
      status: 'completed'
    },
    {
      id: 2,
      agent_name: 'Mehmet Demir',
      call_date: '2023-06-01T15:45:00',
      phone_number: '+905551112234',
      duration: '00:03:15',
      queue: 'Satış',
      status: 'pending'
    },
    {
      id: 3,
      agent_name: 'Ayşe Kaya',
      call_date: '2023-06-01T16:15:00',
      phone_number: '+905551112235',
      duration: '00:07:45',
      queue: 'Destek',
      status: 'completed'
    }
  ];
  
  // Arama terimine göre çağrıları filtrele
  const filteredCalls = calls.filter(call => 
    call.phone_number.includes(searchTerm) || 
    call.agent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Duruma göre chip renkleri
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
  
  // Değerlendirme sayfasına yönlendirme
  const handleEvaluate = (callId) => {
    navigate(`/calls/${callId}/evaluate`);
  };
  
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
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FilterIcon />
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
              <TableCell align="center">İşlemler</TableCell>
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
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<AssessmentIcon />}
                      onClick={() => handleEvaluate(call.id)}
                    >
                      Değerlendir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm
                    ? 'Arama kriterlerine uygun çağrı bulunamadı.'
                    : 'Henüz çağrı kaydı bulunmuyor.'}
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
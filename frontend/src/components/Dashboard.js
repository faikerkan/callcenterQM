import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/dashboardSlice';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider,
  Container,
  useTheme
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  AccessTime as PendingIcon, 
  CheckCircle as CompletedIcon, 
  Star as StarIcon,
  CheckCircleOutline as CheckIcon,
  HourglassEmpty,
  Error as ErrorIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.dashboard);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Durum rengini belirleyen yardımcı fonksiyon
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'in-progress':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Durum ikonu belirleyen yardımcı fonksiyon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon fontSize="small" />;
      case 'pending':
        return <HourglassEmpty fontSize="small" />;
      case 'in-progress':
        return <HourglassEmpty fontSize="small" />;
      default:
        return null;
    }
  };

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', maxWidth: 500 }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Bir hata oluştu
          </Typography>
          <Typography variant="body1">{error}</Typography>
        </Paper>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş Geldiniz, {user?.firstName || 'Kullanıcı'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Çağrı Merkezi Kalite Yönetimi ve Performans Analizi Sistemi
        </Typography>
      </Box>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderTop: `4px solid ${theme.palette.primary.main}`
            }}
          >
            <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{stats.totalCalls}</Typography>
            <Typography variant="body1" color="textSecondary">
              Toplam Çağrı
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderTop: `4px solid ${theme.palette.warning.main}`
            }}
          >
            <PendingIcon sx={{ color: theme.palette.warning.main, fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{stats.pendingEvaluations}</Typography>
            <Typography variant="body1" color="textSecondary">
              Bekleyen Değerlendirme
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderTop: `4px solid ${theme.palette.success.main}`
            }}
          >
            <CompletedIcon sx={{ color: theme.palette.success.main, fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{stats.completedEvaluations}</Typography>
            <Typography variant="body1" color="textSecondary">
              Tamamlanan Değerlendirme
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderTop: `4px solid ${theme.palette.info.main}`
            }}
          >
            <StarIcon sx={{ color: theme.palette.info.main, fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{stats.averageScore}%</Typography>
            <Typography variant="body1" color="textSecondary">
              Ortalama Puan
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Son Çağrılar Listesi */}
      <Paper elevation={3} sx={{ p: 0 }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h6">Son Çağrılar</Typography>
        </Box>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {stats.recentCalls.length > 0 ? (
            stats.recentCalls.map((call, index) => (
              <React.Fragment key={call.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Chip
                      icon={getStatusIcon(call.status)}
                      label={call.status === 'completed' ? 'Tamamlandı' : call.status === 'pending' ? 'Bekliyor' : 'İşlemde'}
                      sx={{
                        bgcolor: getStatusColor(call.status),
                        color: 'white'
                      }}
                      size="small"
                    />
                  }
                >
                  <ListItemText
                    primary={call.agentName}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {call.phoneNumber}
                        </Typography>
                        {' — '}{formatDate(call.callDate)}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < stats.recentCalls.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Henüz çağrı kaydı bulunmamaktadır." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Dashboard; 
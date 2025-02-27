import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Headset as HeadsetIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/dashboardSlice';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Chart.js kayıt
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    dispatch(fetchDashboardStats(timeRange));
  }, [dispatch, timeRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in_progress':
        return <HourglassEmptyIcon color="info" />;
      case 'pending':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon />;
    }
  };

  // Pasta grafik verileri
  const pieData = {
    labels: ['Tamamlanan', 'Devam Eden', 'Bekleyen'],
    datasets: [
      {
        data: [
          stats?.evaluation_stats?.completed || 0,
          stats?.evaluation_stats?.in_progress || 0,
          stats?.evaluation_stats?.pending || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Çubuk grafik verileri
  const barData = {
    labels: stats?.agent_performance?.map(agent => agent.name) || [],
    datasets: [
      {
        label: 'Ortalama Puan',
        data: stats?.agent_performance?.map(agent => agent.average_score) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Müşteri Temsilcisi Performansı',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
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
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş Geldiniz, {user?.username || 'Kullanıcı'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* İstatistik Kartları */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Toplam Çağrı
              </Typography>
              <PhoneIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats?.total_calls || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1, mt: 1 }}>
              Son {timeRange === 'day' ? 'gün' : timeRange === 'week' ? 'hafta' : 'ay'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Değerlendirmeler
              </Typography>
              <AssessmentIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats?.total_evaluations || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1, mt: 1 }}>
              Son {timeRange === 'day' ? 'gün' : timeRange === 'week' ? 'hafta' : 'ay'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Müşteri Temsilcileri
              </Typography>
              <HeadsetIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats?.total_agents || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1, mt: 1 }}>
              Aktif temsilciler
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Ortalama Puan
              </Typography>
              <PersonIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {stats?.average_score?.toFixed(1) || 0}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1, mt: 1 }}>
              Tüm değerlendirmeler
            </Typography>
          </Paper>
        </Grid>
        
        {/* Grafikler */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Değerlendirme Durumu
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={pieData} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Müşteri Temsilcisi Performansı
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
        
        {/* Son Değerlendirmeler */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Son Değerlendirmeler
            </Typography>
            <List>
              {stats?.recent_evaluations?.map((evaluation, index) => (
                <React.Fragment key={evaluation.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <AssessmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${evaluation.agent_name} - ${evaluation.call_date}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Puan: {evaluation.total_score}
                          </Typography>
                          {` — ${evaluation.comments?.substring(0, 60)}...`}
                        </React.Fragment>
                      }
                    />
                    <Chip 
                      label={evaluation.status} 
                      color={getStatusColor(evaluation.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < stats.recent_evaluations.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
              {(!stats?.recent_evaluations || stats.recent_evaluations.length === 0) && (
                <ListItem>
                  <ListItemText primary="Henüz değerlendirme bulunmamaktadır." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Son Çağrılar */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Son Çağrılar
            </Typography>
            <List>
              {stats?.recent_calls?.map((call, index) => (
                <React.Fragment key={call.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <PhoneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${call.agent_name} - ${call.phone_number}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {new Date(call.call_date).toLocaleString('tr-TR')}
                          </Typography>
                          {` — ${call.duration}, ${call.queue}`}
                        </React.Fragment>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(call.evaluation_status)}
                    </Box>
                  </ListItem>
                  {index < stats.recent_calls.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
              {(!stats?.recent_calls || stats.recent_calls.length === 0) && (
                <ListItem>
                  <ListItemText primary="Henüz çağrı bulunmamaktadır." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 
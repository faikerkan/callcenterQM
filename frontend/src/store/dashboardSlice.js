import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Mock data - API entegrasyonu olmadığı için
const MOCK_DASHBOARD_DATA = {
  totalCalls: 125,
  pendingEvaluations: 18,
  completedEvaluations: 107,
  averageScore: 87.5,
  recentCalls: [
    {
      id: 1,
      agentName: 'Mehmet Yılmaz',
      callDate: '2023-08-07T10:15:30',
      phoneNumber: '+90 555 123 4567',
      duration: '00:04:23',
      status: 'completed',
      score: 92
    },
    {
      id: 2,
      agentName: 'Ayşe Demir',
      callDate: '2023-08-07T11:22:45',
      phoneNumber: '+90 532 987 6543',
      duration: '00:12:51',
      status: 'pending',
      score: null
    },
    {
      id: 3,
      agentName: 'Ali Kaya',
      callDate: '2023-08-06T16:05:12',
      phoneNumber: '+90 505 456 7890',
      duration: '00:07:15',
      status: 'completed',
      score: 78
    },
    {
      id: 4,
      agentName: 'Zeynep Şahin',
      callDate: '2023-08-06T09:33:20',
      phoneNumber: '+90 535 234 5678',
      duration: '00:03:47',
      status: 'completed',
      score: 95
    },
    {
      id: 5,
      agentName: 'Okan Yıldız',
      callDate: '2023-08-05T14:45:08',
      phoneNumber: '+90 542 345 6789',
      duration: '00:09:32',
      status: 'in-progress',
      score: null
    }
  ]
};

// Dashboard istatistikleri getirme işlemi için async thunk
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/dashboard/stats/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // API entegrasyonu için mock veri dönüş
      // 500ms gecikme ekleyerek gerçekçi bir yükleme durumu simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return MOCK_DASHBOARD_DATA;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Dashboard verileri alınırken bir hata oluştu'
      );
    }
  }
);

// Dashboard slice oluşturma
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalCalls: 0,
      pendingEvaluations: 0,
      completedEvaluations: 0,
      averageScore: 0,
      recentCalls: []
    },
    loading: false,
    error: null
  },
  reducers: {
    clearDashboardErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDashboardStats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Dashboard verileri alınamadı';
      });
  }
});

export const { clearDashboardErrors } = dashboardSlice.actions;

export default dashboardSlice.reducer; 
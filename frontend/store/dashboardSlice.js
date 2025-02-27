import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (timeRange = 'week', { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/dashboard/stats/?time_range=${timeRange}`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'İstatistikler yüklenirken bir hata oluştu.'
      );
    }
  }
);

// Initial state
const initialState = {
  stats: null,
  loading: false,
  error: null
};

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer; 
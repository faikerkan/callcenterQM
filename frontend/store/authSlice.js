import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, { username, password });
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Giriş başarısız. Lütfen tekrar deneyin.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await axios.post(`${API_URL}/auth/logout/`, {}, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
      }
      
      // Token ve kullanıcı bilgilerini localStorage'dan sil
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Çıkış yapılırken bir hata oluştu.'
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return null;
      }
      
      // Token geçerliliğini kontrol et
      const response = await axios.get(`${API_URL}/auth/user/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      
      return {
        token,
        user: response.data
      };
    } catch (error) {
      // Token geçersizse localStorage'ı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return rejectWithValue(
        error.response?.data?.detail || 'Oturum süresi doldu. Lütfen tekrar giriş yapın.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`
        }
      };
      
      const response = await axios.put(`${API_URL}/users/${userId}/`, userData, config);
      
      // Güncellenmiş kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Profil güncellenirken bir hata oluştu.'
      );
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer; 
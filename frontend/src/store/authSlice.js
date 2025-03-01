import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'yi bir değişkene atayalım
const API_URL = 'http://localhost:8000/api';

// Mock veri - gerçek backend bağlantısı olmadığı için
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    firstName: 'Ahmet',
    lastName: 'Yönetici',
    role: 'admin',
    employeeId: 'A001',
    team: 'Yönetim',
    token: 'mock-jwt-token-admin-123456'
  }
];

// Giriş işlemi için async thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/auth/login/`, credentials);
      // return response.data;
      
      // Mock kullanıcı doğrulama
      const user = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        return rejectWithValue('Geçersiz kullanıcı adı veya şifre');
      }
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', user.token);
      return {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          employeeId: user.employeeId,
          team: user.team
        },
        token: user.token
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Giriş yapılırken bir hata oluştu'
      );
    }
  }
);

// Token yenileme işlemi için async thunk
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      // LocalStorage'dan token'ı al
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Token bulunamadı');
      }
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/auth/refresh-token/`, { token });
      // return response.data;
      
      // Mock token doğrulama
      const user = MOCK_USERS.find(u => u.token === token);
      
      if (!user) {
        localStorage.removeItem('token');
        return rejectWithValue('Geçersiz veya süresi dolmuş token');
      }
      
      return {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          employeeId: user.employeeId,
          team: user.team
        },
        token: user.token
      };
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(
        error.response?.data?.message || 'Token yenilenirken bir hata oluştu'
      );
    }
  }
);

// Çıkış işlemi için async thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // await axios.post(`${API_URL}/auth/logout/`);
      
      // LocalStorage'dan token'ı kaldır
      localStorage.removeItem('token');
      
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Çıkış yapılırken bir hata oluştu'
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCredentials } = authSlice.actions;

export default authSlice.reducer;
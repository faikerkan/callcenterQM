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
  },
  {
    id: 2,
    username: 'expert',
    password: 'expert123',
    firstName: 'Ayşe',
    lastName: 'Uzman',
    role: 'expert',
    employeeId: 'E001',
    team: 'Kalite',
    token: 'mock-jwt-token-expert-123456'
  },
  {
    id: 3,
    username: 'agent',
    password: 'agent123',
    firstName: 'Mehmet',
    lastName: 'Temsilci',
    role: 'agent',
    employeeId: 'T001',
    team: 'Satış',
    token: 'mock-jwt-token-agent-123456'
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
      // LocalStorage'dan token'ı sil
      localStorage.removeItem('token');
      
      // Gerçek API çağrısı - isteğe bağlı
      // await axios.post(`${API_URL}/auth/logout/`);
      
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Çıkış yapılırken bir hata oluştu'
      );
    }
  }
);

// Auth slice oluşturma
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  },
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
        state.error = action.payload || 'Giriş işlemi başarısız';
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Token yenileme işlemi başarısız';
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
        state.error = action.payload || 'Çıkış işlemi başarısız';
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
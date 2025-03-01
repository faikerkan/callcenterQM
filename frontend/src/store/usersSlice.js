import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'yi bir değişkene atayalım
const API_URL = 'http://localhost:8000/api';

// Mock kullanıcı verileri - gerçek backend bağlantısı olmadığı için
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
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
  }
];

// Kullanıcıları getirme işlemi için async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/users/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      return [...MOCK_USERS];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcılar getirilirken bir hata oluştu'
      );
    }
  }
);

// Kullanıcı oluşturma işlemi için async thunk
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/users/`, userData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      const newUser = {
        id: Date.now(),
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcı oluşturulurken bir hata oluştu'
      );
    }
  }
);

// Kullanıcı güncelleme işlemi için async thunk
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.put(`${API_URL}/users/${id}/`, userData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      return {
        id,
        ...userData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu'
      );
    }
  }
);

// Kullanıcı silme işlemi için async thunk
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.delete(`${API_URL}/users/${id}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return id;
      
      // Mock veri dönüşü - gerçek silme yerine isActive false yapılıyor
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu'
      );
    }
  }
);

// Initial state
const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  success: false
};

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Kullanıcıyı tamamen kaldır
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, selectUser, clearSelectedUser } = usersSlice.actions;

export default usersSlice.reducer; 
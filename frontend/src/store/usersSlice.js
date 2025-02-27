import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api/v1';

// Mock veri (gerçek API bağlantısı için daha sonra değiştirilecek)
let MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'Kullanıcı',
    email: 'admin@example.com',
    role: 'admin',
    team: 'Yönetim',
    employeeId: 'EMP001',
    isActive: true
  },
  {
    id: 2,
    username: 'expert1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@example.com',
    role: 'expert',
    team: 'Kalite Kontrol',
    employeeId: 'EMP002',
    isActive: true
  },
  {
    id: 3,
    username: 'agent1',
    firstName: 'Ayşe',
    lastName: 'Demir',
    email: 'ayse@example.com',
    role: 'agent',
    team: 'Müşteri Hizmetleri',
    employeeId: 'EMP003',
    isActive: true
  },
  {
    id: 4,
    username: 'agent2',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet@example.com',
    role: 'agent',
    team: 'Teknik Destek',
    employeeId: 'EMP004',
    isActive: false
  }
];

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const response = await axios.get(`${API_URL}/users/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      return MOCK_USERS;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu'
      );
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const response = await axios.post(`${API_URL}/users/`, userData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 700)); // Gerçekçi bir yükleme süresi
      
      // Kullanıcı adının benzersiz olduğunu kontrol et
      const isUsernameTaken = MOCK_USERS.some(user => 
        user.username.toLowerCase() === userData.username.toLowerCase()
      );
      
      if (isUsernameTaken) {
        return rejectWithValue('Bu kullanıcı adı zaten kullanılıyor');
      }
      
      // Yeni bir ID oluştur (gerçek API'da bu backend tarafından yapılacak)
      const newId = Math.max(...MOCK_USERS.map(user => user.id), 0) + 1;
      
      const newUser = {
        id: newId,
        ...userData,
        isActive: true
      };
      
      // Mock data'ya ekle (gerçek API'da gerek olmayacak)
      // Readonly property hatasını önlemek için yeni bir dizi oluşturup atama yapıyoruz
      MOCK_USERS = [...MOCK_USERS, newUser];
      
      return newUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kullanıcı eklenirken bir hata oluştu'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const response = await axios.put(`${API_URL}/users/${userId}/`, userData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 600)); // Gerçekçi bir yükleme süresi
      
      // Kullanıcıyı bul ve güncelle (gerçek API'da gerek olmayacak)
      const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return rejectWithValue('Kullanıcı bulunamadı');
      }
      
      // Kullanıcı adının benzersiz olduğunu kontrol et (kendi kullanıcı adı hariç)
      const isUsernameTaken = MOCK_USERS.some(user => 
        user.id !== userId && 
        user.username.toLowerCase() === userData.username.toLowerCase()
      );
      
      if (isUsernameTaken) {
        return rejectWithValue('Bu kullanıcı adı zaten kullanılıyor');
      }
      
      const updatedUser = {
        ...MOCK_USERS[userIndex],
        ...userData,
        id: userId // ID'nin korunduğundan emin oluyoruz
      };
      
      // Readonly property hatasını önlemek için yeni bir dizi oluşturup atama yapıyoruz
      const updatedUsers = [...MOCK_USERS];
      updatedUsers[userIndex] = updatedUser;
      MOCK_USERS = updatedUsers;
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kullanıcı güncellenirken bir hata oluştu'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const response = await axios.delete(`${API_URL}/users/${userId}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return { userId };
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      // Kullanıcıyı bul (gerçek API'da gerek olmayacak)
      const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return rejectWithValue('Kullanıcı bulunamadı');
      }
      
      // Kullanıcıyı devre dışı bırak (silmek yerine)
      const updatedUsers = [...MOCK_USERS];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        isActive: false
      };
      MOCK_USERS = updatedUsers;
      
      return { userId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kullanıcı silinirken bir hata oluştu'
      );
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    success: false,
    currentUser: null
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
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
        state.error = action.payload || 'Kullanıcılar yüklenirken bir hata oluştu';
      })
      
      // createUser
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
        state.error = action.payload || 'Kullanıcı eklenirken bir hata oluştu';
        state.success = false;
      })
      
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcı güncellenirken bir hata oluştu';
        state.success = false;
      })
      
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Soft delete - kullanıcıyı silmiyor, sadece inactive yapıyor
        const index = state.users.findIndex(user => user.id === action.payload.userId);
        if (index !== -1) {
          state.users[index].isActive = false;
        }
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcı silinirken bir hata oluştu';
        state.success = false;
      });
  }
});

export const { clearErrors, clearSuccess, setCurrentUser, clearCurrentUser } = usersSlice.actions;

export default usersSlice.reducer; 
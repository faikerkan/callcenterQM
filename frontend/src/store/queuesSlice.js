import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api/v1';

// Mock veri (gerçek API bağlantısı için daha sonra değiştirilecek)
let MOCK_QUEUES = [
  {
    id: 1,
    name: 'Müşteri Hizmetleri',
    description: 'Genel müşteri soruları ve destek',
    active: true,
    priority: 1,
    sla: 60, // Saniye cinsinden
    agents: [2, 3], // Agent ID'leri
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-02-20T14:30:00Z'
  },
  {
    id: 2,
    name: 'Teknik Destek',
    description: 'Teknik sorunlar ve ürün desteği',
    active: true,
    priority: 2,
    sla: 120, // Saniye cinsinden
    agents: [4],
    createdAt: '2023-01-15T10:05:00Z',
    updatedAt: '2023-02-20T14:35:00Z'
  },
  {
    id: 3,
    name: 'Satış',
    description: 'Ürün satışları ve fiyatlandırma soruları',
    active: true,
    priority: 3,
    sla: 90, // Saniye cinsinden
    agents: [3, 4],
    createdAt: '2023-01-15T10:10:00Z',
    updatedAt: '2023-02-20T14:40:00Z'
  },
  {
    id: 4,
    name: 'Şikayetler',
    description: 'Müşteri şikayetleri ve çözümleri',
    active: false,
    priority: 4,
    sla: 45, // Saniye cinsinden
    agents: [2],
    createdAt: '2023-01-15T10:15:00Z',
    updatedAt: '2023-02-20T14:45:00Z'
  }
];

// Async Thunks
export const fetchQueues = createAsyncThunk(
  'queues/fetchQueues',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const { auth } = getState();
      // const response = await axios.get(`${API_URL}/queues/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      return MOCK_QUEUES;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kuyruklar yüklenirken bir hata oluştu'
      );
    }
  }
);

export const createQueue = createAsyncThunk(
  'queues/createQueue',
  async (queueData, { rejectWithValue, getState }) => {
    try {
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const { auth } = getState();
      // const response = await axios.post(`${API_URL}/queues/`, queueData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 700)); // Gerçekçi bir yükleme süresi
      
      // Kuyruk adının benzersiz olduğunu kontrol et
      const isNameTaken = MOCK_QUEUES.some(queue => 
        queue.name.toLowerCase() === queueData.name.toLowerCase()
      );
      
      if (isNameTaken) {
        return rejectWithValue('Bu kuyruk adı zaten kullanılıyor');
      }
      
      // Yeni bir ID oluştur (gerçek API'da bu backend tarafından yapılacak)
      const newId = Math.max(...MOCK_QUEUES.map(queue => queue.id), 0) + 1;
      
      const now = new Date().toISOString();
      const newQueue = {
        id: newId,
        ...queueData,
        active: true,
        createdAt: now,
        updatedAt: now
      };
      
      // Mock data'ya ekle (gerçek API'da gerek olmayacak)
      MOCK_QUEUES = [...MOCK_QUEUES, newQueue];
      
      return newQueue;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kuyruk eklenirken bir hata oluştu'
      );
    }
  }
);

export const updateQueue = createAsyncThunk(
  'queues/updateQueue',
  async ({ queueId, queueData }, { rejectWithValue, getState }) => {
    try {
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const { auth } = getState();
      // const response = await axios.put(`${API_URL}/queues/${queueId}/`, queueData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 600)); // Gerçekçi bir yükleme süresi
      
      // Kuyruğu bul ve güncelle (gerçek API'da gerek olmayacak)
      const queueIndex = MOCK_QUEUES.findIndex(queue => queue.id === queueId);
      
      if (queueIndex === -1) {
        return rejectWithValue('Kuyruk bulunamadı');
      }
      
      // Kuyruk adının benzersiz olduğunu kontrol et (kendi adı hariç)
      const isNameTaken = MOCK_QUEUES.some(queue => 
        queue.id !== queueId && 
        queue.name.toLowerCase() === queueData.name.toLowerCase()
      );
      
      if (isNameTaken) {
        return rejectWithValue('Bu kuyruk adı zaten kullanılıyor');
      }
      
      const updatedQueue = {
        ...MOCK_QUEUES[queueIndex],
        ...queueData,
        id: queueId, // ID'nin korunduğundan emin oluyoruz
        updatedAt: new Date().toISOString()
      };
      
      // Readonly property hatasını önlemek için yeni bir dizi oluşturup atama yapıyoruz
      const updatedQueues = [...MOCK_QUEUES];
      updatedQueues[queueIndex] = updatedQueue;
      MOCK_QUEUES = updatedQueues;
      
      return updatedQueue;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kuyruk güncellenirken bir hata oluştu'
      );
    }
  }
);

export const deleteQueue = createAsyncThunk(
  'queues/deleteQueue',
  async (queueId, { rejectWithValue, getState }) => {
    try {
      // Gerçek API çağrısı (şu an mock data kullanıyoruz)
      // const { auth } = getState();
      // const response = await axios.delete(`${API_URL}/queues/${queueId}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return { queueId };
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      // Kuyruğu bul (gerçek API'da gerek olmayacak)
      const queueIndex = MOCK_QUEUES.findIndex(queue => queue.id === queueId);
      
      if (queueIndex === -1) {
        return rejectWithValue('Kuyruk bulunamadı');
      }
      
      // Kuyruğu devre dışı bırak (silmek yerine)
      const updatedQueues = [...MOCK_QUEUES];
      updatedQueues[queueIndex] = {
        ...updatedQueues[queueIndex],
        active: false,
        updatedAt: new Date().toISOString()
      };
      MOCK_QUEUES = updatedQueues;
      
      return { queueId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Kuyruk silinirken bir hata oluştu'
      );
    }
  }
);

// Slice
const queuesSlice = createSlice({
  name: 'queues',
  initialState: {
    queues: [],
    loading: false,
    error: null,
    success: false,
    currentQueue: null
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentQueue: (state, action) => {
      state.currentQueue = action.payload;
    },
    clearCurrentQueue: (state) => {
      state.currentQueue = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchQueues
      .addCase(fetchQueues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueues.fulfilled, (state, action) => {
        state.loading = false;
        state.queues = action.payload;
      })
      .addCase(fetchQueues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kuyruklar yüklenirken bir hata oluştu';
      })
      
      // createQueue
      .addCase(createQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.queues.push(action.payload);
        state.success = true;
      })
      .addCase(createQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kuyruk eklenirken bir hata oluştu';
        state.success = false;
      })
      
      // updateQueue
      .addCase(updateQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateQueue.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.queues.findIndex(queue => queue.id === action.payload.id);
        if (index !== -1) {
          state.queues[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kuyruk güncellenirken bir hata oluştu';
        state.success = false;
      })
      
      // deleteQueue
      .addCase(deleteQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteQueue.fulfilled, (state, action) => {
        state.loading = false;
        // Soft delete - kuyruğu silmiyor, sadece inactive yapıyor
        const index = state.queues.findIndex(queue => queue.id === action.payload.queueId);
        if (index !== -1) {
          state.queues[index].active = false;
        }
        state.success = true;
      })
      .addCase(deleteQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kuyruk silinirken bir hata oluştu';
        state.success = false;
      })
  }
});

export const { clearErrors, clearSuccess, setCurrentQueue, clearCurrentQueue } = queuesSlice.actions;

export default queuesSlice.reducer; 
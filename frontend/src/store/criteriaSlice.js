import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'yi bir değişkene atayalım
const API_URL = 'http://localhost:8000/api';

// Kriterleri getirme işlemi için async thunk
export const fetchCriteria = createAsyncThunk(
  'criteria/fetchCriteria',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/criteria/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      return [
        { id: 1, name: 'Açılış ve Karşılama', description: 'Müşteri uygun şekilde karşılandı mı?', weight: 5, maxScore: 5 },
        { id: 2, name: 'Etkin Dinleme ve Anlama', description: 'Temsilci müşteriyi etkin bir şekilde dinledi ve anladı mı?', weight: 15, maxScore: 15 },
        { id: 3, name: 'Analiz ve Etkin Soru Sorma', description: 'Temsilci doğru analiz yapıp etkin sorular sordu mu?', weight: 15, maxScore: 15 },
        { id: 4, name: 'Görüşme Kirliliği Yaratacak Söylem ve Sesler', description: 'Görüşmede kirlilik yaratan söylem ve sesler var mıydı?', weight: 10, maxScore: 10 },
        { id: 5, name: 'Kendinden Emin, Canlı ve Nezaketli Ses Tonu', description: 'Temsilcinin ses tonu uygun muydu?', weight: 10, maxScore: 10 },
        { id: 6, name: 'Abonenin Sorununun Sahiplenilmesi', description: 'Temsilci abonenin sorununu sahiplendi mi?', weight: 5, maxScore: 5 },
        { id: 7, name: 'Empati', description: 'Temsilci yeterli empati gösterdi mi?', weight: 5, maxScore: 5 },
        { id: 8, name: 'Süre ve Stres Yönetimi', description: 'Temsilci süre ve stresi iyi yönetti mi?', weight: 5, maxScore: 5 },
        { id: 9, name: 'Doğru Yönlendirme', description: 'Temsilci doğru yönlendirme yaptı mı?', weight: 10, maxScore: 10 },
        { id: 10, name: 'Bilgiyi Anlaşılır Biçimde Paylaşma, İkna Etme', description: 'Temsilci bilgiyi anlaşılır şekilde paylaştı ve ikna etti mi?', weight: 10, maxScore: 10 },
        { id: 11, name: 'Uygun Kapanış Anonsu Verildi mi?', description: 'Temsilci uygun kapanış anonsu verdi mi?', weight: 5, maxScore: 5 },
        { id: 12, name: 'İlgili/Yönlendirilen Ekibe İlgili Bilgi Verildi mi?', description: 'Temsilci ilgili ekiplere gerekli bilgileri verdi mi?', weight: 5, maxScore: 5 }
      ];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriterler getirilirken bir hata oluştu'
      );
    }
  }
);

// Kriter ekleme işlemi için async thunk
export const addCriterion = createAsyncThunk(
  'criteria/addCriterion',
  async (criterionData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/criteria/`, criterionData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      const newCriterion = {
        id: Date.now(),
        ...criterionData
      };
      
      return newCriterion;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriter eklenirken bir hata oluştu'
      );
    }
  }
);

// Kriter güncelleme işlemi için async thunk
export const updateCriterion = createAsyncThunk(
  'criteria/updateCriterion',
  async ({ id, criterionData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.put(`${API_URL}/criteria/${id}/`, criterionData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      return {
        id,
        ...criterionData
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriter güncellenirken bir hata oluştu'
      );
    }
  }
);

// Kriter silme işlemi için async thunk
export const deleteCriterion = createAsyncThunk(
  'criteria/deleteCriterion',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.delete(`${API_URL}/criteria/${id}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return id;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriter silinirken bir hata oluştu'
      );
    }
  }
);

// Initial state
const initialState = {
  criteria: [],
  selectedCriterion: null,
  loading: false,
  error: null,
  success: false
};

// Slice
const criteriaSlice = createSlice({
  name: 'criteria',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    selectCriterion: (state, action) => {
      state.selectedCriterion = action.payload;
    },
    clearSelectedCriterion: (state) => {
      state.selectedCriterion = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Criteria
      .addCase(fetchCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = action.payload;
      })
      .addCase(fetchCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Criterion
      .addCase(addCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria.push(action.payload);
        state.success = true;
      })
      .addCase(addCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update Criterion
      .addCase(updateCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCriterion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.criteria.findIndex(criterion => criterion.id === action.payload.id);
        if (index !== -1) {
          state.criteria[index] = { ...state.criteria[index], ...action.payload };
        }
        state.success = true;
      })
      .addCase(updateCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete Criterion
      .addCase(deleteCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = state.criteria.filter(criterion => criterion.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, selectCriterion, clearSelectedCriterion } = criteriaSlice.actions;

export default criteriaSlice.reducer; 
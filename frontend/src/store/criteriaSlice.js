import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock veri - API entegrasyonu olmadığı için
const MOCK_CRITERIA = [
  { id: 1, name: 'Açılış ve Karşılama', description: 'Müşteriye uygun bir şekilde merhaba diyerek kendini tanıtma', weight: 5, maxScore: 5 },
  { id: 2, name: 'Etkin Dinleme ve Anlama', description: 'Müşteriyi aktif dinleme ve doğru anlama', weight: 15, maxScore: 15 },
  { id: 3, name: 'Analiz ve Etkin Soru Sorma', description: 'Müşterinin sorununu analiz etme ve doğru soruları sorma', weight: 15, maxScore: 15 },
  { id: 4, name: 'Görüşme Kirliliği Yaratacak Söylem ve Sesler', description: 'Görüşme sırasında uygunsuz söylem ve seslerden kaçınma', weight: 10, maxScore: 10 },
  { id: 5, name: 'Kendinden Emin, Canlı ve Nezaketli Ses Tonu', description: 'Ses tonunun kendinden emin, canlı ve nezaketli olması', weight: 10, maxScore: 10 },
  { id: 6, name: 'Abonenin Sorununun Sahiplenilmesi', description: 'Müşteri sorununu sahiplenme ve çözüm odaklı yaklaşım', weight: 5, maxScore: 5 },
  { id: 7, name: 'Empati', description: 'Müşteri ile empati kurabilme yeteneği', weight: 5, maxScore: 5 },
  { id: 8, name: 'Süre ve Stres Yönetimi', description: 'Çağrı süresini etkin kullanma ve stres yönetimi', weight: 5, maxScore: 5 },
  { id: 9, name: 'Doğru Yönlendirme', description: 'Müşteriyi doğru departmana veya çözüme yönlendirme', weight: 10, maxScore: 10 },
  { id: 10, name: 'Bilgiyi Anlaşılır Biçimde Paylaşma, İkna Etme', description: 'Bilgileri anlaşılır şekilde aktarma ve ikna edici olma', weight: 10, maxScore: 10 },
  { id: 11, name: 'Uygun Kapanış Anonsu Verildi mi?', description: 'Görüşme sonunda uygun kapanış cümlelerini kullanma', weight: 5, maxScore: 5 },
  { id: 12, name: 'İlgili/Yönlendirilen Ekiple İlgili Bilgi Verildi mi?', description: 'Müşteriye yönlendirilen ekip hakkında yeterli bilgi verme', weight: 5, maxScore: 5 }
];

// API URL
const API_URL = 'http://localhost:8000/api/v1';

// Kriterleri getirme işlemi için async thunk
export const fetchCriteria = createAsyncThunk(
  'criteria/fetchCriteria',
  async (_, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/criteria/`);
      // return response.data;
      
      // API entegrasyonu için mock veri dönüş
      // 500ms gecikme ekleyerek gerçekçi bir yükleme durumu simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return MOCK_CRITERIA;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriterler alınırken bir hata oluştu'
      );
    }
  }
);

// Kriter ekleme işlemi için async thunk
export const addCriterion = createAsyncThunk(
  'criteria/addCriterion',
  async (criterionData, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/criteria/`, criterionData);
      // return response.data;
      
      // API entegrasyonu için mock veri dönüş
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Yeni kriter için ID oluştur
      const newId = Math.max(...MOCK_CRITERIA.map(c => c.id)) + 1;
      
      const newCriterion = {
        id: newId,
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

// createCriterion, addCriterion'un bir alias'ı olarak tanımla
export const createCriterion = addCriterion;

// Kriter güncelleme işlemi için async thunk
export const updateCriterion = createAsyncThunk(
  'criteria/updateCriterion',
  async ({ id, criterionData }, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.put(`${API_URL}/criteria/${id}/`, criterionData);
      // return response.data;
      
      // API entegrasyonu için mock veri dönüş
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
  async (id, { rejectWithValue }) => {
    try {
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // await axios.delete(`${API_URL}/criteria/${id}/`);
      // return id;
      
      // API entegrasyonu için mock veri dönüş
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kriter silinirken bir hata oluştu'
      );
    }
  }
);

// Kriterlerin toplam ağırlığını hesaplama yardımcı fonksiyonu
const calculateTotalWeight = (criteria) => {
  return criteria.reduce((total, criterion) => total + criterion.weight, 0);
};

// Criteria slice oluşturma
const criteriaSlice = createSlice({
  name: 'criteria',
  initialState: {
    criteria: [],
    loading: false,
    error: null,
    success: null,
    totalWeight: 0
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCriteria
      .addCase(fetchCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = action.payload;
        state.totalWeight = calculateTotalWeight(action.payload);
      })
      .addCase(fetchCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kriterler alınamadı';
      })
      
      // addCriterion
      .addCase(addCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria.push(action.payload);
        state.totalWeight = calculateTotalWeight(state.criteria);
        state.success = 'Kriter başarıyla eklendi';
      })
      .addCase(addCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kriter eklenemedi';
      })
      
      // updateCriterion
      .addCase(updateCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCriterion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.criteria.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.criteria[index] = action.payload;
        }
        state.totalWeight = calculateTotalWeight(state.criteria);
        state.success = 'Kriter başarıyla güncellendi';
      })
      .addCase(updateCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kriter güncellenemedi';
      })
      
      // deleteCriterion
      .addCase(deleteCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = state.criteria.filter(c => c.id !== action.payload);
        state.totalWeight = calculateTotalWeight(state.criteria);
        state.success = 'Kriter başarıyla silindi';
      })
      .addCase(deleteCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kriter silinemedi';
      });
  }
});

export const { clearErrors, clearSuccess } = criteriaSlice.actions;

export default criteriaSlice.reducer; 
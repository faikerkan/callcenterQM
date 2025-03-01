import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'yi bir değişkene atayalım
const API_URL = 'http://localhost:8000/api';

// Değerlendirmeleri getirme işlemi için async thunk
export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/evaluations/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 800)); // Gerçekçi bir yükleme süresi
      
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Değerlendirmeler getirilirken bir hata oluştu'
      );
    }
  }
);

// Değerlendirme detayını getirme işlemi için async thunk
export const fetchEvaluationById = createAsyncThunk(
  'evaluations/fetchEvaluationById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/evaluations/${id}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      // Değerlendirme bulunamadı
      return rejectWithValue('Değerlendirme bulunamadı');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Değerlendirme detayı getirilirken bir hata oluştu'
      );
    }
  }
);

// Değerlendirme oluşturma işlemi için async thunk
export const createEvaluation = createAsyncThunk(
  'evaluations/createEvaluation',
  async (evaluationData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/evaluations/`, evaluationData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 1000)); // Gerçekçi bir yükleme süresi
      
      const newEvaluation = {
        id: Date.now(),
        ...evaluationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newEvaluation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Değerlendirme oluşturulurken bir hata oluştu'
      );
    }
  }
);

// Değerlendirme güncelleme işlemi için async thunk
export const updateEvaluation = createAsyncThunk(
  'evaluations/updateEvaluation',
  async ({ id, evaluationData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.put(`${API_URL}/evaluations/${id}/`, evaluationData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return response.data;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 800)); // Gerçekçi bir yükleme süresi
      
      return {
        id,
        ...evaluationData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Değerlendirme güncellenirken bir hata oluştu'
      );
    }
  }
);

// Değerlendirme silme işlemi için async thunk
export const deleteEvaluation = createAsyncThunk(
  'evaluations/deleteEvaluation',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.delete(`${API_URL}/evaluations/${id}/`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      // return id;
      
      // Mock veri dönüşü
      await new Promise(resolve => setTimeout(resolve, 500)); // Gerçekçi bir yükleme süresi
      
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Değerlendirme silinirken bir hata oluştu'
      );
    }
  }
);

// Initial state
const initialState = {
  evaluations: [],
  selectedEvaluation: null,
  loading: false,
  error: null,
  success: false
};

// Slice
const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    selectEvaluation: (state, action) => {
      state.selectedEvaluation = action.payload;
    },
    clearSelectedEvaluation: (state) => {
      state.selectedEvaluation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Evaluation By Id
      .addCase(fetchEvaluationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvaluation = action.payload;
      })
      .addCase(fetchEvaluationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Evaluation
      .addCase(createEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations.push(action.payload);
        state.success = true;
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update Evaluation
      .addCase(updateEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.evaluations.findIndex(evaluation => evaluation.id === action.payload.id);
        if (index !== -1) {
          state.evaluations[index] = { ...state.evaluations[index], ...action.payload };
        }
        state.success = true;
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete Evaluation
      .addCase(deleteEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = state.evaluations.filter(evaluation => evaluation.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, selectEvaluation, clearSelectedEvaluation } = evaluationsSlice.actions;

export default evaluationsSlice.reducer; 
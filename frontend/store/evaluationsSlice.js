import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Async thunks
export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/evaluations/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Değerlendirmeler yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const fetchEvaluationById = createAsyncThunk(
  'evaluations/fetchEvaluationById',
  async (evaluationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/evaluations/${evaluationId}/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Değerlendirme detayları yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'evaluations/createEvaluation',
  async (evaluationData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/evaluations/`, evaluationData, {
      //   headers: {
      //     Authorization: `Token ${auth.token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Mock yanıt oluştur
      const newEvaluation = {
        id: `${Date.now()}`, // Benzersiz ID oluştur
        call: {
          id: evaluationData.callId,
          agentId: evaluationData.agentId,
          agentName: 'Mehmet Temsilci', // Gerçek uygulamada bu veri API'den gelecek
          phoneNumber: evaluationData.phoneNumber,
          callDate: evaluationData.callDate,
          duration: '00:05:00', // Örnek süre
          queue: evaluationData.queue
        },
        evaluator: {
          id: auth.user.id,
          name: `${auth.user.firstName} ${auth.user.lastName}`
        },
        totalScore: evaluationData.totalScore,
        createdAt: new Date().toISOString()
      };
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newEvaluation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Değerlendirme oluşturulurken bir hata oluştu.'
      );
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluations/updateEvaluation',
  async ({ evaluationId, evaluationData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/evaluations/${evaluationId}/`, evaluationData, {
        headers: {
          Authorization: `Token ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Değerlendirme güncellenirken bir hata oluştu.'
      );
    }
  }
);

export const deleteEvaluation = createAsyncThunk(
  'evaluations/deleteEvaluation',
  async (evaluationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/evaluations/${evaluationId}/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return evaluationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Değerlendirme silinirken bir hata oluştu.'
      );
    }
  }
);

// Initial state
const initialState = {
  evaluations: [
    // Mock değerlendirme verileri
    {
      id: '1001',
      call: {
        id: '101',
        agentId: '3', // agent kullanıcısının ID'si
        agentName: 'Mehmet Temsilci',
        phoneNumber: '+90 555 123 4567',
        callDate: '2023-08-10T14:30:00',
        duration: '00:05:30',
        queue: 'Destek'
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 81.5,
      createdAt: '2023-08-11T09:45:00'
    },
    {
      id: '1002',
      call: {
        id: '102',
        agentId: '3', // agent kullanıcısının ID'si
        agentName: 'Mehmet Temsilci',
        phoneNumber: '+90 555 789 1234',
        callDate: '2023-08-10T10:15:00',
        duration: '00:12:45',
        queue: 'Satış'
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 92.0,
      createdAt: '2023-08-11T11:30:00'
    },
    {
      id: '1003',
      call: {
        id: '103',
        agentId: '3', // agent kullanıcısının ID'si
        agentName: 'Mehmet Temsilci',
        phoneNumber: '+90 555 456 7890',
        callDate: new Date().toISOString(), // Bugünün tarihi
        duration: '00:08:15',
        queue: 'Teknik Destek'
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 68.5,
      createdAt: new Date().toISOString() // Bugünün tarihi
    }
  ],
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
      
      // Fetch Evaluation By ID
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
        state.evaluations = [action.payload, ...state.evaluations];
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
        state.evaluations = state.evaluations.map(evaluation => 
          evaluation.id === action.payload.id ? action.payload : evaluation
        );
        if (state.selectedEvaluation && state.selectedEvaluation.id === action.payload.id) {
          state.selectedEvaluation = action.payload;
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
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = state.evaluations.filter(evaluation => evaluation.id !== action.payload);
        if (state.selectedEvaluation && state.selectedEvaluation.id === action.payload) {
          state.selectedEvaluation = null;
        }
        state.success = true;
      })
      .addCase(deleteEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { clearError, clearSuccess } = evaluationsSlice.actions;

export default evaluationsSlice.reducer; 
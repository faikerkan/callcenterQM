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
      const response = await axios.post(`${API_URL}/evaluations/`, evaluationData, {
        headers: {
          Authorization: `Token ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
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
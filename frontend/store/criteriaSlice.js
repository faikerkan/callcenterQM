import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Async thunks
export const fetchCriteria = createAsyncThunk(
  'criteria/fetchCriteria',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/criteria/`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchCriterionById = createAsyncThunk(
  'criteria/fetchCriterionById',
  async (criterionId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/criteria/${criterionId}/`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createCriterion = createAsyncThunk(
  'criteria/createCriterion',
  async (criterionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      };

      const response = await axios.post(`${API_URL}/criteria/`, criterionData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateCriterion = createAsyncThunk(
  'criteria/updateCriterion',
  async ({ criterionId, criterionData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      };

      const response = await axios.put(`${API_URL}/criteria/${criterionId}/`, criterionData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteCriterion = createAsyncThunk(
  'criteria/deleteCriterion',
  async (criterionId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      };

      await axios.delete(`${API_URL}/criteria/${criterionId}/`, config);
      return criterionId;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
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
  success: false,
};

// Slice
const criteriaSlice = createSlice({
  name: 'criteria',
  initialState,
  reducers: {
    clearCriteriaError: (state) => {
      state.error = null;
    },
    clearCriteriaSuccess: (state) => {
      state.success = false;
    },
    resetCriteriaState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch criteria
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
      
      // Fetch criterion by ID
      .addCase(fetchCriterionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriterionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCriterion = action.payload;
      })
      .addCase(fetchCriterionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create criterion
      .addCase(createCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.criteria.push(action.payload);
      })
      .addCase(createCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update criterion
      .addCase(updateCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        const index = state.criteria.findIndex(
          (criterion) => criterion.id === action.payload.id
        );
        
        if (index !== -1) {
          state.criteria[index] = action.payload;
        }
        
        if (state.selectedCriterion && state.selectedCriterion.id === action.payload.id) {
          state.selectedCriterion = action.payload;
        }
      })
      .addCase(updateCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete criterion
      .addCase(deleteCriterion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCriterion.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = state.criteria.filter((criterion) => criterion.id !== action.payload);
        
        if (state.selectedCriterion && state.selectedCriterion.id === action.payload) {
          state.selectedCriterion = null;
        }
      })
      .addCase(deleteCriterion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCriteriaError, clearCriteriaSuccess, resetCriteriaState } = criteriaSlice.actions;

export default criteriaSlice.reducer; 
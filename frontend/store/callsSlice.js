import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8000/api';

// Async thunks
export const fetchCalls = createAsyncThunk(
  'calls/fetchCalls',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/calls/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Çağrılar yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const fetchCallById = createAsyncThunk(
  'calls/fetchCallById',
  async (callId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/calls/${callId}/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Çağrı detayları yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const uploadCall = createAsyncThunk(
  'calls/uploadCall',
  async (callData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // FormData oluştur
      const formData = new FormData();
      formData.append('audio_file', callData.audio_file);
      formData.append('agent_name', callData.agent_name);
      formData.append('phone_number', callData.phone_number);
      formData.append('call_date', callData.call_date);
      formData.append('queue', callData.queue);
      
      const response = await axios.post(`${API_URL}/calls/`, formData, {
        headers: {
          Authorization: `Token ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Çağrı yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const deleteCall = createAsyncThunk(
  'calls/deleteCall',
  async (callId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/calls/${callId}/`, {
        headers: {
          Authorization: `Token ${auth.token}`
        }
      });
      
      return callId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Çağrı silinirken bir hata oluştu.'
      );
    }
  }
);

// Initial state
const initialState = {
  calls: [],
  selectedCall: null,
  loading: false,
  error: null,
  uploadSuccess: false
};

// Slice
const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUploadSuccess: (state) => {
      state.uploadSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Calls
      .addCase(fetchCalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = action.payload;
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Call By Id
      .addCase(fetchCallById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCall = action.payload;
      })
      .addCase(fetchCallById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload Call
      .addCase(uploadCall.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadCall.fulfilled, (state, action) => {
        state.loading = false;
        state.calls.push(action.payload);
        state.uploadSuccess = true;
      })
      .addCase(uploadCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      })
      
      // Delete Call
      .addCase(deleteCall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCall.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = state.calls.filter(call => call.id !== action.payload);
        if (state.selectedCall && state.selectedCall.id === action.payload) {
          state.selectedCall = null;
        }
      })
      .addCase(deleteCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearUploadSuccess } = callsSlice.actions;

export default callsSlice.reducer; 
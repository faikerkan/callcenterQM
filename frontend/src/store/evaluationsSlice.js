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
      console.log('fetchEvaluations çağrıldı, token:', auth.token ? 'Token var' : 'Token yok');
      
      if (!auth.token) {
        console.error('Token bulunamadı');
        return rejectWithValue('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/evaluations/`, {
      //   headers: {
      //     Authorization: `Token ${auth.token}`
      //   }
      // });
      
      // Mock veri dönüşü
      console.log('Mock değerlendirme verileri döndürülüyor');
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redux store'dan mevcut değerlendirmeleri al
      const currentState = getState().evaluations.evaluations;
      console.log('Mevcut değerlendirmeler:', currentState);
      
      // Eğer store'da değerlendirmeler varsa onları döndür, yoksa initialState'deki mock verileri döndür
      return currentState && currentState.length > 0 ? currentState : initialState.evaluations;
    } catch (error) {
      console.error('fetchEvaluations hatası:', error);
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
      console.log('fetchEvaluationById çağrıldı, ID:', evaluationId);
      
      if (!auth.token) {
        console.error('Token bulunamadı');
        return rejectWithValue('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.get(`${API_URL}/evaluations/${evaluationId}/`, {
      //   headers: {
      //     Authorization: `Token ${auth.token}`
      //   }
      // });
      
      // Redux store'dan mevcut değerlendirmeleri al
      const { evaluations } = getState().evaluations;
      console.log('Mevcut değerlendirmeler:', evaluations);
      
      // ID'ye göre değerlendirmeyi bul
      const evaluation = evaluations.find(e => e.id === evaluationId);
      
      if (!evaluation) {
        console.error('Değerlendirme bulunamadı:', evaluationId);
        return rejectWithValue('Değerlendirme bulunamadı.');
      }
      
      console.log('Bulunan değerlendirme:', evaluation);
      
      // Değerlendirme için kriterler ekle (gerçek uygulamada API'den gelecek)
      const evaluationWithCriteria = {
        ...evaluation,
        criteria: [
          { id: 1, name: 'Müşteri Selamlama', description: 'Müşteri uygun şekilde karşılandı mı?', weight: 10 },
          { id: 2, name: 'Problem Anlama', description: 'Temsilci müşterinin sorununu doğru şekilde anladı mı?', weight: 20 },
          { id: 3, name: 'Çözüm Sunma', description: 'Temsilci uygun ve etkili bir çözüm sundu mu?', weight: 30 },
          { id: 4, name: 'İletişim Becerileri', description: 'Temsilcinin genel iletişim becerileri nasıldı?', weight: 25 },
          { id: 5, name: 'Kapanış', description: 'Görüşme uygun şekilde sonlandırıldı mı?', weight: 15 }
        ],
        scores: evaluation.scores || {
          1: 80,
          2: 75,
          3: 85,
          4: 90,
          5: 70
        }
      };
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return evaluationWithCriteria;
    } catch (error) {
      console.error('fetchEvaluationById hatası:', error);
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
      console.log('createEvaluation çağrıldı, gelen veriler:', evaluationData);
      const { auth } = getState();
      
      if (!auth.user) {
        console.error('Kullanıcı bilgisi bulunamadı');
        return rejectWithValue('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      // Gerçek API çağrısı - şu an mock kullanıyoruz
      // const response = await axios.post(`${API_URL}/evaluations/`, evaluationData, {
      //   headers: {
      //     Authorization: `Token ${auth.token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Mock yanıt oluştur
      const newEvaluation = {
        id: `eval_${Date.now()}`, // Benzersiz ID oluştur
        call: {
          id: evaluationData.callId,
          agentId: evaluationData.agentId,
          agentName: 'Fatma Şahin', // Gerçek uygulamada bu veri API'den gelecek
          phoneNumber: evaluationData.phoneNumber || '5551234567',
          callDate: evaluationData.callDate,
          duration: '00:05:00', // Örnek süre
          queue: evaluationData.queue,
          audioUrl: evaluationData.audioFile ? URL.createObjectURL(evaluationData.audioFile) : ''
        },
        evaluator: {
          id: auth.user.id,
          name: `${auth.user.firstName} ${auth.user.lastName}`
        },
        scores: evaluationData.scores || {},
        criticalErrors: evaluationData.criticalErrors || {},
        comments: evaluationData.comments || '',
        totalScore: evaluationData.totalScore,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };
      
      console.log('Oluşturulan değerlendirme:', newEvaluation);
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newEvaluation;
    } catch (error) {
      console.error('createEvaluation hatası:', error);
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
        agentName: 'Fatma Şahin',
        phoneNumber: '+90 555 123 4567',
        callDate: '2023-08-10T14:30:00',
        duration: '00:05:30',
        queue: 'Destek',
        audioUrl: ''
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 81.5,
      createdAt: '2023-08-11T09:45:00',
      scores: {
        1: 80,
        2: 75,
        3: 85,
        4: 90,
        5: 70
      }
    },
    {
      id: '1002',
      call: {
        id: '102',
        agentId: '3', // agent kullanıcısının ID'si
        agentName: 'Fatma Şahin',
        phoneNumber: '+90 555 789 1234',
        callDate: '2023-08-10T10:15:00',
        duration: '00:12:45',
        queue: 'Satış',
        audioUrl: ''
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 92.0,
      createdAt: '2023-08-11T11:30:00',
      scores: {
        1: 95,
        2: 90,
        3: 92,
        4: 88,
        5: 94
      }
    },
    {
      id: '1003',
      call: {
        id: '103',
        agentId: '3', // agent kullanıcısının ID'si
        agentName: 'Fatma Şahin',
        phoneNumber: '+90 555 456 7890',
        callDate: new Date().toISOString(), // Bugünün tarihi
        duration: '00:08:15',
        queue: 'Teknik Destek',
        audioUrl: ''
      },
      evaluator: {
        id: '2', // expert kullanıcısının ID'si
        name: 'Ayşe Uzman'
      },
      totalScore: 68.5,
      createdAt: new Date().toISOString(), // Bugünün tarihi
      scores: {
        1: 65,
        2: 70,
        3: 60,
        4: 75,
        5: 72
      }
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
    },
    // Değerlendirme listesini manuel olarak güncelleme için yeni reducer
    addEvaluation: (state, action) => {
      state.evaluations.unshift(action.payload);
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
        console.log('Değerlendirme başarıyla oluşturuldu:', action.payload);
        // Yeni değerlendirmeyi listenin başına ekle
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

export const { clearError, clearSuccess, addEvaluation } = evaluationsSlice.actions;

export default evaluationsSlice.reducer; 
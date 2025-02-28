import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import criteriaReducer from './criteriaSlice';
import dashboardReducer from './dashboardSlice';
import queuesReducer from './queuesSlice';
import evaluationsReducer from './evaluationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    criteria: criteriaReducer,
    dashboard: dashboardReducer,
    queues: queuesReducer,
    evaluations: evaluationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 
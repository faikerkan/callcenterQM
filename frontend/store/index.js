import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import callsReducer from './callsSlice';
import evaluationsReducer from './evaluationsSlice';
import dashboardReducer from './dashboardSlice';
import usersReducer from './usersSlice';
import criteriaReducer from './criteriaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calls: callsReducer,
    evaluations: evaluationsReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    criteria: criteriaReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 
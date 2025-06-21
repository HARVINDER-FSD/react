import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
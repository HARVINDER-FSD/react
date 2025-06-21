import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    auth: authReducer,
  },
});
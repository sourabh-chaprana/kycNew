import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Action/auth/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});


import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, setAuthToken, removeAuthToken } from '../../utils/api';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      // Backend response shape:
      // {
      //   success: true,
      //   message: 'User registered successfully',
      //   data: { user: {...}, token: '...' }
      // }
      const response = await api.auth.register({ name, email, password, role });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token) {
        setAuthToken(token);
      }

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Backend response shape:
      // {
      //   success: true,
      //   message: 'Login successful',
      //   data: { user: {...}, token: '...' }
      // }
      const response = await api.auth.login({ email, password });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token) {
        setAuthToken(token);
      }

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Backend response shape:
      // {
      //   success: true,
      //   data: { user: {...} }
      // }
      const response = await api.auth.getMe();
      return response?.data?.user;
    } catch (error) {
      removeAuthToken();
      return rejectWithValue(error.message);
    }
  }
);


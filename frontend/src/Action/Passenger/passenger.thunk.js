import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Get all PNRs with optional status filter
export const getPNRs = createAsyncThunk(
  'passenger/getPNRs',
  async (status = null, { rejectWithValue }) => {
    try {
      const response = await api.passenger.getPNRs(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get single PNR by ID
export const getPNRById = createAsyncThunk(
  'passenger/getPNRById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.passenger.getPNRById(id);
      return response.data.pnr;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new PNR
export const createPNR = createAsyncThunk(
  'passenger/createPNR',
  async (pnrData, { rejectWithValue }) => {
    try {
      const response = await api.passenger.createPNR(pnrData);
      return response.data.pnr;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update passenger status
export const updatePassengerStatus = createAsyncThunk(
  'passenger/updatePassengerStatus',
  async ({ pnrId, passengerId, status, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await api.passenger.updatePassengerStatus(pnrId, passengerId, {
        status,
        rejectionReason
      });
      return response.data.pnr;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Approve all pending passengers
export const approveAllPending = createAsyncThunk(
  'passenger/approveAllPending',
  async (pnrId, { rejectWithValue }) => {
    try {
      const response = await api.passenger.approveAllPending(pnrId);
      return response.data.pnr;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete PNR
export const deletePNR = createAsyncThunk(
  'passenger/deletePNR',
  async (id, { rejectWithValue }) => {
    try {
      await api.passenger.deletePNR(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


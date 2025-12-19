import { createSlice } from '@reduxjs/toolkit';
import {
  getPNRs,
  getPNRById,
  createPNR,
  updatePassengerStatus,
  approveAllPending,
  deletePNR
} from './passenger.thunk';

const initialState = {
  pnrs: [],
  currentPNR: null,
  stats: {
    pending: 0,
    approved: 0,
    declined: 0,
    partially: 0
  },
  loading: false,
  error: null,
};

const passengerSlice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPNR: (state) => {
      state.currentPNR = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get PNRs
      .addCase(getPNRs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPNRs.fulfilled, (state, action) => {
        state.loading = false;
        state.pnrs = action.payload.pnrs;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(getPNRs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch PNRs';
      })
      // Get PNR by ID
      .addCase(getPNRById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPNRById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPNR = action.payload;
        state.error = null;
      })
      .addCase(getPNRById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch PNR';
      })
      // Create PNR
      .addCase(createPNR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPNR.fulfilled, (state, action) => {
        state.loading = false;
        state.pnrs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPNR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create PNR';
      })
      // Update passenger status
      .addCase(updatePassengerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassengerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPNR = action.payload;
        const index = state.pnrs.findIndex(p => p.id === updatedPNR.id);
        if (index !== -1) {
          state.pnrs[index] = updatedPNR;
        }
        if (state.currentPNR && state.currentPNR.id === updatedPNR.id) {
          state.currentPNR = updatedPNR;
        }
        state.error = null;
      })
      .addCase(updatePassengerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update passenger status';
      })
      // Approve all pending
      .addCase(approveAllPending.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveAllPending.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPNR = action.payload;
        const index = state.pnrs.findIndex(p => p.id === updatedPNR.id);
        if (index !== -1) {
          state.pnrs[index] = updatedPNR;
        }
        if (state.currentPNR && state.currentPNR.id === updatedPNR.id) {
          state.currentPNR = updatedPNR;
        }
        state.error = null;
      })
      .addCase(approveAllPending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to approve all pending';
      })
      // Delete PNR
      .addCase(deletePNR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePNR.fulfilled, (state, action) => {
        state.loading = false;
        state.pnrs = state.pnrs.filter(p => p.id !== action.payload);
        if (state.currentPNR && state.currentPNR.id === action.payload) {
          state.currentPNR = null;
        }
        state.error = null;
      })
      .addCase(deletePNR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete PNR';
      });
  },
});

export const { clearError, clearCurrentPNR } = passengerSlice.actions;
export default passengerSlice.reducer;


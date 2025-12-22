import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllAgents,
  fetchAgentPassengers
} from './agent.thunk';

const initialState = {
  agents: [],
  selectedAgent: null,
  agentPassengers: [],
  stats: {
    pending: 0,
    approved: 0,
    declined: 0,
    partially: 0
  },
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAgent: (state) => {
      state.selectedAgent = null;
      state.agentPassengers = [];
      state.stats = {
        pending: 0,
        approved: 0,
        declined: 0,
        partially: 0
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all agents
      .addCase(fetchAllAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch agents';
      })
      // Fetch agent passengers
      .addCase(fetchAgentPassengers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentPassengers.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgent = action.payload.agent;
        state.agentPassengers = action.payload.pnrs;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchAgentPassengers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch agent passengers';
      });
  },
});

export const { clearError, clearSelectedAgent } = agentSlice.actions;
export default agentSlice.reducer;


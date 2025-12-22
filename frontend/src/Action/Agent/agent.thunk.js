import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Get all agents
export const fetchAllAgents = createAsyncThunk(
  'agent/fetchAllAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.agent.getAllAgents();
      return response.data.agents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get passengers/PNRs for a specific agent
export const fetchAgentPassengers = createAsyncThunk(
  'agent/fetchAgentPassengers',
  async ({ agentId, status = null }, { rejectWithValue }) => {
    try {
      const queryParam = status ? `?status=${status}` : '';
      const response = await api.agent.getAgentPassengers(agentId, queryParam);
      return {
        agent: response.data.agent,
        pnrs: response.data.pnrs,
        stats: response.data.stats
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


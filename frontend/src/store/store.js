import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Action/auth/auth.slice';
import passengerReducer from '../Action/Passenger/passenger.slice';
import agentReducer from '../Action/Agent/agent.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    passenger: passengerReducer,
    agent: agentReducer,
  },
});


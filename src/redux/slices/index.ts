import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { apiSlice } from './apiSlice';
import appFlowSlice from './appFlowSlice';
import { baseApi } from '../../ApiManager/baseApi';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  appFlow:appFlowSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

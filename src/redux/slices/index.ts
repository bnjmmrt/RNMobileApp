import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import appFlowSlice from './appFlowSlice';
import { createBaseApi } from '../../ApiManager/createBaseApiWithoutFecthBaseQuery';


// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [createBaseApi.reducerPath]: createBaseApi.reducer,
  appFlow:appFlowSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

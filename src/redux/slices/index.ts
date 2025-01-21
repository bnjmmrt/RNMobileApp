import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import appFlowSlice from './appFlowSlice';
import appFlowApiDataSlice from './appFlowApiDataSlice';
import { createBaseApi } from '../../ApiManager/createBaseApiWithoutFecthBaseQuery';


// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [createBaseApi.reducerPath]: createBaseApi.reducer,
  appFlow:appFlowSlice,
  appFlowApiData:appFlowApiDataSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

import {combineReducers} from '@reduxjs/toolkit';
import {createBaseApi} from '../../ApiManager/createBaseApi';
import appFlowApiDataSlice from './appFlowApiDataSlice';
import appFlowSlice from './appFlowSlice';
import authReducer from './authSlice';
import safeAreaViewConfigSlice from './safeAreaViewConfigSlice';
import appSettingsSlice from './appSettingsSlice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [createBaseApi.reducerPath]: createBaseApi.reducer,
  appFlow: appFlowSlice,
  appFlowApiData: appFlowApiDataSlice,
  safeAreaView: safeAreaViewConfigSlice,
  appSettings: appSettingsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

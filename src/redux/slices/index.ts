import {combineReducers} from '@reduxjs/toolkit';
import {createBaseApi} from '../../ApiManager/createBaseApi';
import appFlowApiDataSlice from './appGlobalDataSlice';
import appFlowSlice from './appFlowSlice';
import authReducer from './authSlice';
import safeAreaViewConfigSlice from './safeAreaViewConfigSlice';
import appSettingsSlice from './appSettingsSlice';
import bottomTabsConfigSlice from './bottomTabsConfigSlice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [createBaseApi.reducerPath]: createBaseApi.reducer,
  appFlow: appFlowSlice,
  appFlowApiData: appFlowApiDataSlice,
  safeAreaView: safeAreaViewConfigSlice,
  appSettings: appSettingsSlice,
  bottomTabBar: bottomTabsConfigSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

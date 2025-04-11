import { combineReducers } from '@reduxjs/toolkit';
import { createBaseApi } from '../../ApiManager/createBaseApi';
import appFlowApiDataSlice from './appGlobalDataSlice';
import appFlowSlice from './appFlowSlice';
import authReducer from './authSlice';
import safeAreaViewConfigSlice from './safeAreaViewConfigSlice';
import appSettingsSlice from './appSettingsSlice';
import bottomTabsConfigSlice from './bottomTabsConfigSlice';
import rspvSlice from './rspvSlice';
import inviteGuestsFlowSlice from './inviteGuestsFlowSlice';
import eventSlice from './eventSlice';
import keyboardSlice from './keyboardSlice';
import listSkipSlice from './listSkipSlice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  [createBaseApi.reducerPath]: createBaseApi.reducer,
  appFlow: appFlowSlice,
  appFlowApiData: appFlowApiDataSlice,
  safeAreaView: safeAreaViewConfigSlice,
  appSettings: appSettingsSlice,
  bottomTabBar: bottomTabsConfigSlice,
  rspv: rspvSlice,
  inviteGuestsFlow: inviteGuestsFlowSlice,
  event: eventSlice,
  keyboard: keyboardSlice,
  listSkip: listSkipSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

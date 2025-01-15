import { Middleware, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import {rootReducer} from './slices';
import { apiSlice } from './slices/apiSlice';

// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth','appFlow'],
};
// AsyncStorage.clear()
const loggerMiddleware: Middleware = createLogger({
  // Options for the logger
  collapsed: true,
  diff: true,
});

// Array of middlewares
const middlewares: Middleware[] = [loggerMiddleware,apiSlice.middleware];

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Toolkit: Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(middlewares),
});

// Redux Persist: Persistor
export const persistor = persistStore(store);

// Export types of Reducer and Persistor
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };

// import {legacy_createStore, applyMiddleware} from 'redux';
// import {thunk} from 'redux-thunk';
// import rootReducers from './reducers';
// const middleware = [thunk];
// const store = legacy_createStore(rootReducers, applyMiddleware(...middleware));
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../ApiManager/baseApi'; // Base API slice

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

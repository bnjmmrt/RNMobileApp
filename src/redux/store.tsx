import {legacy_createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import rootReducers from './reducers';
const middleware = [thunk];
const store = legacy_createStore(rootReducers, applyMiddleware(...middleware));
export default store;

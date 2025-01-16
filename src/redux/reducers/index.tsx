import {combineReducers} from 'redux';
import LoginReducer from './LoginReducer';
import SignUpReducer from './SignUpReducer';
import SignUpProfileReducer from './SignUpProfileReducer';
import RegionReducer from './RegionReducer';
import { FETCH_LOGOUT_SUCCESS, LOGOUT } from '../types';

const appReducer = combineReducers({
  login: LoginReducer,
  signup: SignUpReducer,
  profileReducer: SignUpProfileReducer,
  regionReducer: RegionReducer
});

const rootReducer = (state:any, action:any) => {
  if (action.type === FETCH_LOGOUT_SUCCESS) {
    state = undefined; // Clear all state on logout
  }
  return appReducer(state, action);
};

export default rootReducer;


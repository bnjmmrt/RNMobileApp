import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loginData: any;
  token: string;
  userId: string;
  role: string;
  isGuest: boolean;
}

const initialState: AuthState = {
  loginData: {
    isInvited: false,
    isSignUpCompleted: false,
    varifyStatus: 0,
    userId: '',
    roles: [
      {
        roleId: '',
        roleName: '',
      },
    ],
    isGuest: false,
    token: '',
  },
  token: '',
  userId: '',
  role: 'non_member',
  isGuest: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<any>) {
      state.loginData = { ...action.payload, isInvited: false };
    },
    setAuthToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    setUserId(state, action: PayloadAction<any>) {
      state.userId = action.payload;
    },
    setRole(state, action: PayloadAction<any>) {
      state.role = action.payload;
    },
    setIsGuest(state, action: PayloadAction<any>) {
      state.isGuest = action.payload;
    },
    resetLoginData(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const { setLoginData, setAuthToken, setUserId, setRole, setIsGuest, resetLoginData } = authSlice.actions;

export default authSlice.reducer;

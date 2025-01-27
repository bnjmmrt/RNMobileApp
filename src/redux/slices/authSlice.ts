import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loginData: object;
  token: string;
}

const initialState: AuthState = {
  loginData: {},
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<any>) {
      state.loginData = action.payload;
    },
    setAuthToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },
  },
});

export const { setLoginData, setAuthToken } = authSlice.actions;

export default authSlice.reducer;

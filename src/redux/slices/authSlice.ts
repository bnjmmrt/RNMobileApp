import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loginData: object;
}

const initialState: AuthState = {
  loginData: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<any>) {
      state.loginData = action.payload;
    },
  },
});

export const { setLoginData } = authSlice.actions;

export default authSlice.reducer;

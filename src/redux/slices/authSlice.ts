import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userData: object;
  biometricType: string;
  isBiometricEnabled: boolean;
  biometricAuthTimestamp: string;
}

const initialState: AuthState = {
  userData: {},
  biometricType: "",
  isBiometricEnabled: false,
  biometricAuthTimestamp: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBiometricType(state, action: PayloadAction<any>) {
      state.biometricType = action.payload;
    },
    setIsBiometricEnabled(state, action: PayloadAction<any>) {
      state.isBiometricEnabled = action.payload;
    },
    setBiometricAuthTimestamp(state, action: PayloadAction<any>) {
      state.biometricAuthTimestamp = action.payload;
    },
  },
});

export const { setBiometricType, setIsBiometricEnabled, setBiometricAuthTimestamp } = authSlice.actions;

export default authSlice.reducer;

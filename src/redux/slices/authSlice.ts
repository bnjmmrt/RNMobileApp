import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  loginData: any;
  token: string;
}

const initialState: AuthState = {
  loginData: {
    isInvited: false,
    isSignUpCompleted: false,
    varifyStatus: 0,
    userId: '6267f02a-0c86-4752-9e62-8bada629d830',
    roles: [
      {
        roleId: '1223343534435',
        roleName: 'non_member',
      },
    ],
    token: '',
  },
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<any>) {
      state.loginData = {...action.payload, isInvited: false};
    },
    setAuthToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    resetLoginData() {
      console.log('Sayyed rest Called');
      return initialState;
    },
  },
});

export const {setLoginData, setAuthToken, resetLoginData} = authSlice.actions;

export default authSlice.reducer;

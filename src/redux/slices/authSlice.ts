import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type roleType = 'member' | 'non_member' | 'host';
export interface role {
  roleId: string;
  roleName: roleType;
}
interface AuthState {
  userId: string;
  role: roleType | '';
  roleId: string | '';
  roles: role[];
  token: string;
  isGuest: boolean;
  varifyStatus: 0 | 1;
  profilePicture: string | undefined;
  companyLogo: string | undefined;
}

const initialState: AuthState = {
  userId: '',
  role: '',
  roleId: '',
  roles: [],
  token: '',
  isGuest: false,
  varifyStatus: 0,
  profilePicture: undefined,
  companyLogo: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action: PayloadAction<AuthState>) {
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.roleId = action.payload.roleId;
      state.roles = action.payload.roles;
      state.token = action.payload.token;
      state.isGuest = action.payload.isGuest;
      state.varifyStatus = action.payload.varifyStatus;
      state.companyLogo = action.payload.companyLogo;
      state.profilePicture = action.payload.profilePicture;
    },
    setAuthToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    setCompanyLogo(state, action: PayloadAction<string | undefined>) {
      state.companyLogo = action.payload;
    },
    setProfilePicture(state, action: PayloadAction<string | undefined>) {
      state.profilePicture = action.payload;
    },
    setUserId(state, action: PayloadAction<any>) {
      state.userId = action.payload;
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },
    setRoleId(state, action: PayloadAction<string>) {
      state.roleId = action.payload;
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

export const {
  setLoginData,
  setAuthToken,
  setUserId,
  setRole,
  setRoleId,
  setIsGuest,
  resetLoginData,
  setProfilePicture,
  setCompanyLogo,
} = authSlice.actions;

export default authSlice.reducer;

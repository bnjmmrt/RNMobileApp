import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDetailsState {
  firstName: string;
  lastName: string;
  gender: string | null;
  baseCity: string;
  birthday: string;
  email: string;
  phone: string;
  creativeFocus: string[];
  interest: string[];
  profilePic:any;
  pageProgress: number;
  isEmailVerified: boolean;
}

const initialState: UserDetailsState = {
  firstName: '',
  lastName: '',
  gender: null,
  baseCity: '',
  birthday: '',
  email: '',
  phone: '',
  creativeFocus: [],
  interest: [],
  profilePic:'',
  pageProgress: 1,
  isEmailVerified: false,
};

const appFlowSlice = createSlice({
  name: 'appFlow',
  initialState,
  reducers: {
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setGender(state, action: PayloadAction<string | null>) {
      state.gender = action.payload;
    },
    setBaseCity(state, action: PayloadAction<string>) {
      state.baseCity = action.payload;
    },
    setBirthday(state, action: PayloadAction<string>) {
      state.birthday = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setCreativeFocus(state, action: PayloadAction<string[]>) {
      state.creativeFocus = action.payload;
    },
    setInterest(state, action: PayloadAction<string[]>) {
      state.interest = action.payload;
    },
    setPageProgress(state, action: PayloadAction<number>) {
      state.pageProgress = action.payload;
    },
    setProfilePic(state, action: PayloadAction<any>) {
      state.profilePic = action.payload;
    },
    setIsEmailVerified(state, action: PayloadAction<any>) {
      state.isEmailVerified = action.payload;
    },
    resetAppFlowDetails(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setGender,
  setBaseCity,
  setBirthday,
  setEmail,
  setPhone,
  setCreativeFocus,
  setInterest,
  setPageProgress,
  setProfilePic,
  setIsEmailVerified,
  resetAppFlowDetails,
} = appFlowSlice.actions;

export default appFlowSlice.reducer;

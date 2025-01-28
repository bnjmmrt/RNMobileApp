import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Address={address:string,placeId:string}
export interface UserDetailsState {
  firstName: string;
  lastName: string;
  gender: number;
  baseCity:Address ;
  birthday: string;
  email: string;
  phone: string;
  creativeFocus: string[];
  interest: string[];
  profilePic:any;
  pageProgress: number;
  isEmailVerified: boolean;
  isEmailPhoneBothVerified: boolean;
  countryCodeFlag:string;
  countryCallingCode:string
}

const initialState: UserDetailsState = {
  firstName: '',
  lastName: '',
  gender: 0,
  baseCity: {address:'',placeId:''},
  birthday: '',
  email: '',
  phone: '',
  creativeFocus: [],
  interest: [],
  profilePic:'',
  pageProgress: 1,
  isEmailVerified: false,
  isEmailPhoneBothVerified: false,
  countryCodeFlag:'',
  countryCallingCode:''
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
    setGender(state, action: PayloadAction<number>) {
      state.gender = action.payload;
    },
    setBaseCity(state, action: PayloadAction<{address:string,placeId:string}>) {
      state.baseCity.address = action.payload.address;
      state.baseCity.placeId = action.payload.placeId;
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
    setCountryCallingCode(state, action: PayloadAction<string>) {
      state.countryCallingCode = action.payload;
    },
    setCountryCodeFlag(state, action: PayloadAction<string>) {
      state.countryCodeFlag = action.payload;
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
    setIsEmailPhoneBothVerified(state, action: PayloadAction<any>) {
      state.isEmailPhoneBothVerified = action.payload;
    },

    getAppFlowDetails(state) {
      // return state object
    return state
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
  setCountryCallingCode,
  setCountryCodeFlag,
  setCreativeFocus,
  setInterest,
  setPageProgress,
  setProfilePic,
  setIsEmailVerified,
  setIsEmailPhoneBothVerified,
  getAppFlowDetails,
  resetAppFlowDetails,
} = appFlowSlice.actions;

export default appFlowSlice.reducer;

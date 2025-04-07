import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppFlowApiDataState {
  creativeFocus: any[];
  interests: any[];
  profileData: any;
  notiCount:number
}

const initialState: AppFlowApiDataState = {
  creativeFocus: [],
  interests: [],
  profileData: {},
  notiCount:0
};

const appFlowApiDataSlice = createSlice({
  name: 'appFlowApiData',
  initialState,
  reducers: {
    setCreativeFocus(state, action: PayloadAction<any[]>) {
      state.creativeFocus = action.payload;
    },
    setInterests(state, action: PayloadAction<any[]>) {
      state.interests = action.payload;
    },

    setProfileData(state, action: PayloadAction<any>) {
      state.profileData = action.payload;
    },
    resetProfileData(state) {
      // Reset profile data to initial values
      state.profileData = {};
    },
    resetAppGlobalData(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
    setNotificationCount(state, action: PayloadAction<any>) {
      state.notiCount = action.payload;
    },
  },
});

export const {
  setCreativeFocus,
  setInterests,
  resetAppGlobalData,
  setProfileData,
  resetProfileData,
  setNotificationCount,
} = appFlowApiDataSlice.actions;

export default appFlowApiDataSlice.reducer;

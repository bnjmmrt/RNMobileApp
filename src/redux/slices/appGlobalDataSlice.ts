import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppFlowApiDataState {
  creativeFocus: any[];
  interests: any[];
  isFirstTimeLoggedIn: boolean;
  memberProfileData:any
}

const initialState: AppFlowApiDataState = {
  creativeFocus: [],
  interests: [],
  isFirstTimeLoggedIn: false,
  memberProfileData:{}
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
    setIsFirstTimeLoggedIn(state, action: PayloadAction<boolean>) {
      state.isFirstTimeLoggedIn = action.payload;
    },
    setMemberProfileData(state, action: PayloadAction<any>) {
      state.memberProfileData = action.payload;
    },
    resetAppGlobalData(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {setCreativeFocus, setInterests,setIsFirstTimeLoggedIn,setMemberProfileData, resetAppGlobalData} =
  appFlowApiDataSlice.actions;

export default appFlowApiDataSlice.reducer;

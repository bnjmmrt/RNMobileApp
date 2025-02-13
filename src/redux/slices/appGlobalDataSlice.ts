import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppFlowApiDataState {
  creativeFocus: any[];
  interests: any[];
  profileData:any;
  
}

const initialState: AppFlowApiDataState = {
  creativeFocus: [],
  interests: [],
  profileData:{}
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
    resetAppGlobalData(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {setCreativeFocus, setInterests, resetAppGlobalData,setProfileData} =
  appFlowApiDataSlice.actions;

export default appFlowApiDataSlice.reducer;

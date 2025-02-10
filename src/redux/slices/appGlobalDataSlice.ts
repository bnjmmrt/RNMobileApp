import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppFlowApiDataState {
  creativeFocus: any[];
  interests: any[];
  memberProfileData:any
}

const initialState: AppFlowApiDataState = {
  creativeFocus: [],
  interests: [],
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
    setMemberProfileData(state, action: PayloadAction<any>) {
      state.memberProfileData = action.payload;
    },
    resetAppGlobalData(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {setCreativeFocus, setInterests, resetAppGlobalData,setMemberProfileData} =
  appFlowApiDataSlice.actions;

export default appFlowApiDataSlice.reducer;

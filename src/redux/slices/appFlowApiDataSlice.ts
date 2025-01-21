import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppFlowApiDataState {
  creativeFocus: string[];
  interests: string[];
}

const initialState: AppFlowApiDataState = {
  creativeFocus: [],
  interests: [],
};

const appFlowApiDataSlice = createSlice({
  name: 'appFlowApiData',
  initialState,
  reducers: {
    setCreativeFocus(state, action: PayloadAction<string[]>) {
      state.creativeFocus = action.payload;
    },
    setInterests(state, action: PayloadAction<string[]>) {
      state.interests = action.payload;
    },
    resetAppFlowDetails(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {setCreativeFocus, setInterests, resetAppFlowDetails} =
  appFlowApiDataSlice.actions;

export default appFlowApiDataSlice.reducer;

import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface BottomTabsConfig {
  showBottomTabs: boolean;
}

const initialState: BottomTabsConfig = {
  showBottomTabs: true,
};

export const bottomTabsConfigSlice = createSlice({
  name: 'bottomTabsConfigSlice',
  initialState,
  reducers: {
    changeBottomTabsVisibility: (
      state,
      action: PayloadAction<Partial<BottomTabsConfig>>,
    ) => {
      return {...state, ...action?.payload};
    },
  },
});

export const {changeBottomTabsVisibility} = bottomTabsConfigSlice?.actions;

export default bottomTabsConfigSlice?.reducer;

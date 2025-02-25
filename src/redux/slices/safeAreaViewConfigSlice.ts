import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ColorValue, StatusBarStyle } from 'react-native';
import { COLORS } from 'src/utils/constants';

export interface SafeAreaViewConfig {
  showTopSafeAreaView: boolean;
  topSafeAreaViewColor: ColorValue;
  showBottomSafeAreaView: boolean;
  bottomSafeAreaViewColor: string;
  statusBarStyle: StatusBarStyle;
  translucent: boolean;
}

const initialState: SafeAreaViewConfig = {
  showTopSafeAreaView: true,
  topSafeAreaViewColor: COLORS?.white,
  showBottomSafeAreaView: true,
  bottomSafeAreaViewColor: COLORS?.white,
  statusBarStyle: 'dark-content',
  translucent: false,
};

export const statusBarSlice = createSlice({
  name: 'statusBarSlice',
  initialState,
  reducers: {
    configStatusBar: (
      state,
      action: PayloadAction<Partial<SafeAreaViewConfig>>,
    ) => {
      return { ...state, ...action?.payload };
    },
    changeTopSafeAreaViewColor: (state, action: PayloadAction<ColorValue>) => {
      console.log(action);

      return {
        ...state,
        topSafeAreaViewColor: action.payload,
      };
    },
  },
});

export const { configStatusBar, changeTopSafeAreaViewColor } =
  statusBarSlice?.actions;

export default statusBarSlice?.reducer;

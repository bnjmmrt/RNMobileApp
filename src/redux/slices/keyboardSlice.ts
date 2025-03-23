import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Keyboard {
  keyboardVisible: boolean;
}

const initialState: Keyboard = {
  keyboardVisible: false,
};

export const keyboardSlice = createSlice({
  name: 'keyboardSlice',
  initialState,
  reducers: {
    updateKeyboardState: (state, action: PayloadAction<Partial<Keyboard>>) => {
      return { ...state, ...action?.payload };
    },
  },
});

export const { updateKeyboardState } = keyboardSlice?.actions;

export default keyboardSlice?.reducer;

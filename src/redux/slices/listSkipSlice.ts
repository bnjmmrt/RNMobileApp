import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  manageGuestSkipCount: 0,
};

export const listSkipSlice = createSlice({
  name: 'listSkipSlice',
  initialState,
  reducers: {
    setManageGuestSkip: (state, action: PayloadAction<Partial<number>>) => {
      return { ...state, manageGuestSkipCount: action.payload };
    },
  },
});

export const { setManageGuestSkip } = listSkipSlice?.actions;

export default listSkipSlice?.reducer;

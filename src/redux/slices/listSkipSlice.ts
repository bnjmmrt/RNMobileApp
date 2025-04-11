import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: {
  manageGuestSkipCount: number;
  usersTabAllUsersSkipCount: number;
  inviteGuestUsersSkipCount: number;
  usersTabAllListsSkipCount: number;
} = {
  manageGuestSkipCount: 0,
  usersTabAllUsersSkipCount: 0,
  inviteGuestUsersSkipCount: 0,
  usersTabAllListsSkipCount: 0,
};

export const listSkipSlice = createSlice({
  name: 'listSkipSlice',
  initialState,
  reducers: {
    setManageGuestSkip: (state, action: PayloadAction<Partial<number>>) => {
      state.manageGuestSkipCount = action.payload;
    },
    setUsersTabAllUsersSkip: (
      state,
      action: PayloadAction<Partial<number>>,
    ) => {
      state.usersTabAllUsersSkipCount = action.payload;
    },
    setUsersTabAllListsSkip: (
      state,
      action: PayloadAction<Partial<number>>,
    ) => {
      state.usersTabAllListsSkipCount = action.payload;
    },
    setInviteGuestAllUsersSkip: (
      state,
      action: PayloadAction<Partial<number>>,
    ) => {
      state.inviteGuestUsersSkipCount = action.payload;
    },
  },
});

export const {
  setManageGuestSkip,
  setUsersTabAllUsersSkip,
  setUsersTabAllListsSkip,
  setInviteGuestAllUsersSkip,
} = listSkipSlice?.actions;

export default listSkipSlice?.reducer;

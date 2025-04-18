import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: {
  manageGuestSkipCount: number;
  usersTabAllUsersSkipCount: number;
  inviteGuestUsersSkipCount: number;
  usersTabAllListsSkipCount: number;
  manageGuestRefresh: boolean;
  usersTabAllUsersRefresh: boolean;
  inviteGuestUsersRefresh: boolean;
  usersTabAllListRefresh: boolean;
} = {
  manageGuestSkipCount: 0,
  usersTabAllUsersSkipCount: 0,
  inviteGuestUsersSkipCount: 0,
  usersTabAllListsSkipCount: 0,
  manageGuestRefresh: false,
  usersTabAllUsersRefresh: false,
  inviteGuestUsersRefresh: false,
  usersTabAllListRefresh: false,
};

export const listSkipSlice = createSlice({
  name: 'listSkipSlice',
  initialState,
  reducers: {
    setManageGuestSkip: (state, action: PayloadAction<number>) => {
      state.manageGuestSkipCount = action.payload;
    },
    setUsersTabAllUsersSkip: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.usersTabAllUsersSkipCount = action.payload;
    },
    setUsersTabAllListsSkip: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.usersTabAllListsSkipCount = action.payload;
    },
    setInviteGuestAllUsersSkip: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.inviteGuestUsersSkipCount = action.payload;
    },
    setManageGuestRefresh: (state) => {
      state.manageGuestSkipCount = 0;
      state.manageGuestRefresh = !state.manageGuestRefresh;
    },
    setUsersTabAllUsersRefresh: (
      state,
    ) => {
      state.usersTabAllUsersSkipCount = 0;
      state.usersTabAllUsersRefresh = !state.usersTabAllUsersRefresh
    },
    setUsersTabAllListsRefresh: (
      state,
    ) => {
      state.usersTabAllListsSkipCount = 0;
      state.usersTabAllListRefresh = !state.usersTabAllListRefresh;
    },
    setInviteGuestAllUsersRefresh: (
      state,
    ) => {
      state.inviteGuestUsersSkipCount = 0;
      state.inviteGuestUsersRefresh = !state.inviteGuestUsersRefresh;
    },
  },
});

export const {
  setManageGuestSkip,
  setUsersTabAllUsersSkip,
  setUsersTabAllListsSkip,
  setInviteGuestAllUsersSkip,

  setManageGuestRefresh,
  setUsersTabAllUsersRefresh,
  setUsersTabAllListsRefresh,
  setInviteGuestAllUsersRefresh,
} = listSkipSlice?.actions;

export default listSkipSlice?.reducer;

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
    setManageGuestRefresh: (state) => {
      state.manageGuestRefresh = !state.manageGuestRefresh;
      state.manageGuestSkipCount = 0;
    },
    setUsersTabAllUsersRefresh: (
      state,
    ) => {
      state.usersTabAllUsersRefresh = !state.usersTabAllUsersRefresh
      state.usersTabAllUsersSkipCount = 0;
    },
    setUsersTabAllListsRefresh: (
      state,
    ) => {
      state.usersTabAllListRefresh = !state.usersTabAllListRefresh;
      state.usersTabAllListsSkipCount = 0;
    },
    setInviteGuestAllUsersRefresh: (
      state,
    ) => {
      state.inviteGuestUsersRefresh = !state.inviteGuestUsersRefresh;
      state.inviteGuestUsersSkipCount = 0;
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

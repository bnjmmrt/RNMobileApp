import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: {
    manageGuestSkipCount: number;
    manageGuestRefresh: boolean;

} = {
    manageGuestSkipCount: 0,
    manageGuestRefresh: false,

};

export const listSkipSlice = createSlice({
    name: 'listSkipSlice',
    initialState,
    reducers: {
        setManageGuestSkip: (state, action: PayloadAction<Partial<number>>) => {
            state.manageGuestSkipCount = action.payload;
        },
        setManageGuestRefresh: (state) => {
            state.manageGuestSkipCount = 0;
            state.manageGuestRefresh = !state.manageGuestRefresh;
        },
    },
});

export const {
    setManageGuestSkip,
    setManageGuestRefresh,
} = listSkipSlice?.actions;

export default listSkipSlice?.reducer;

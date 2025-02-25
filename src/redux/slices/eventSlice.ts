import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  id: '',
};

const eventSlice = createSlice({
  name: 'rsvp',
  initialState,
  reducers: {
    setEventId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
  },
});

export const { setEventId } = eventSlice.actions;

export default eventSlice.reducer;

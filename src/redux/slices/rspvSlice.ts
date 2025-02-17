import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Guest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
}

interface RSVPState {
    response: 'Yes' | 'No' | null;
    guests: Guest[];
    selectedGuest: Guest | null;
}

const initialState: RSVPState = {
    response: null,
    guests: [],
    selectedGuest: null,
};

const rsvpSlice = createSlice({
    name: 'rsvp',
    initialState,
    reducers: {
        setResponse(state, action: PayloadAction<'Yes' | 'No'>) {
            state.response = action.payload;
            if (action.payload === 'No') {
                state.selectedGuest = null;
                state.guests = [];
            }
        },
        addGuest(state, action: PayloadAction<Guest>) {
            console.log("Adding guest:", action.payload);
            const exists = state.guests.some(
                guest => (action.payload.email && guest.email === action.payload.email) || (action.payload.phoneNumber && guest.phoneNumber === action.payload.phoneNumber)
            );
            if (!exists) {
                state.guests = [...state.guests, action.payload];
                console.log("Guest added:", state.guests);
            } else {
                console.log("Guest already exists.");
            }
        },
        deleteGuest(state, action: PayloadAction<number>) {
            state.guests = state.guests.filter(guest => guest.id !== action.payload);
        },
        setSelectedGuest(state, action: PayloadAction<Guest | null>) {
            state.selectedGuest = action.payload;
        },
        resetRSVP() {
            return initialState;
        },
    },
});

export const { setResponse, addGuest, deleteGuest, setSelectedGuest, resetRSVP } = rsvpSlice.actions;

export default rsvpSlice.reducer;
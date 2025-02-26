import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Guest {
    id: number;
    firtName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface RSVPState {
    response: 'Yes' | 'No' | null;
    guests: Guest[];
    selectedGuest: Guest | null;
    rspvStatus: string;
}

const initialState: RSVPState = {
    response: null,
    guests: [],
    selectedGuest: null,
    rspvStatus: '',
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
        deleteGuest(state, action: PayloadAction<{ phoneNumber?: string; email?: string }>) {
            const { phoneNumber, email } = action.payload;
            state.guests = state.guests.filter(guest => {
                if (phoneNumber) {
                    return guest.phoneNumber !== phoneNumber;
                } else if (email) {
                    return guest.email !== email;
                }
                return true;
            });
        },
        setSelectedGuest(state, action: PayloadAction<Guest | null>) {
            state.selectedGuest = action.payload;
        },
        resetGuest(state) {
            state.guests = [];
        },
        resetRSVP() {
            return initialState;
        },
        setRsvpStatus(state, action: PayloadAction<any>) {
            state.rspvStatus = action.payload;
        },
    },
});

export const { setResponse, addGuest, deleteGuest, setSelectedGuest, resetRSVP, resetGuest, setRsvpStatus } = rsvpSlice.actions;

export default rsvpSlice.reducer;
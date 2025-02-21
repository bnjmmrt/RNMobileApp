import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserItemInterface } from 'src/screens/UsersModule/UsersListItem';
import { ContactItem } from 'src/utils/hooks/useContactPermission';

export interface UserDetailsState {
  selectedUsers: UserItemInterface[];
  selectedManualUser: ContactItem | null;
  selectedEvent: EventDetailInterface | null;
}

const initialState: UserDetailsState = {
  selectedUsers: [],
  selectedManualUser: null,
  selectedEvent: null,
};

const inviteGuestsFlowSlice = createSlice({
  name: 'inviteGuestsFlowSlice',
  initialState,
  reducers: {
    setSelectedUsersToInvite(
      state,
      action: PayloadAction<UserItemInterface[]>,
    ) {
      state.selectedUsers = action.payload;
    },
    setSelectedManualUser(state, action: PayloadAction<ContactItem>) {
      state.selectedManualUser = action.payload;
    },
    setSelectedEventForInvite(
      state,
      action: PayloadAction<EventDetailInterface>,
    ) {
      state.selectedEvent = action.payload;
    },
  },
});

export const {
  setSelectedUsersToInvite,
  setSelectedManualUser,
  setSelectedEventForInvite,
} = inviteGuestsFlowSlice.actions;

export default inviteGuestsFlowSlice.reducer;

export interface EventDetailInterface {
  admissionType: {
    description: string;
    enabled: boolean;
    id: string;
    name: string;
  };
  ageLimit: {
    description: string;
    enabled: boolean;
    id: string;
    maxAge: number;
    minAge: number;
    name: string;
  };
  autoPublished: boolean;
  capacity: number;
  collaborators: {
    addGuestsToDrafts: boolean;
    chatWithAllGuests: boolean;
    chatWithGuestsByCollaborator: boolean;
    checkInGuests: boolean;
    displayName: string;
    displayNameListEvent: boolean;
    editEventDetailsSettings: boolean;
    email: string;
    generateEventReports: boolean;
    id: string;
    inviteGuestsToEvent: boolean;
    limitInvitations: boolean;
    limitInvitationsNumber: number;
    manageDedicatedSignUpForm: boolean;
    manageInAppRsvpRequests: boolean;
    name: string;
    postAnnouncementsByCollaborator: boolean;
    postAnnouncementsToAllGuests: boolean;
    role: {
      id: string;
      name: string;
    };
    tickets: [
      {
        action: string;
        id: string;
        limitInvitationsNumber: number;
        name: string;
        reassignTo: {
          id: string;
          name: string;
        };
      },
    ];
    viewFullGuestList: boolean;
  }[];
  currentGuestStatus: number;
  description: string;
  enabled: boolean;
  endDate: string;
  eventType: {
    description: string;
    enabled: boolean;
    id: string;
    name: string;
  };
  featuredEventSection: {
    id: string;
    index: number;
    name: string;
  };
  furtherInstructions: string;
  guestId: string;
  guestsCount: number;
  id: string;
  imageCover: string;
  imageFlyer: string;
  invitationDeclinedBy: string;
  isPrivate: boolean;
  limitOnePlus: number;
  location: {
    city: string;
    id: string;
    latitude: number;
    location: string;
    longitude: number;
    placeId: string;
    regionCode: string;
  };
  name: string;
  owner: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    profilePicture: string;
  };
  publishDate: string;
  qrCodeUtilization: number;
  quizQuestions: {
    enabled: boolean;
    id: string;
    order: number;
    question: string;
    required: boolean;
  }[];
  rsvpDeadline: string;
  showLocation: boolean;
  startDate: string;
  status: number;
  talents: {
    contact: string;
    description: string;
    enabled: boolean;
    id: string;
    imageKeyUrl: string;
    name: string;
    socialNetwork: string;
  }[];
  ticketTypes: {
    capacity: number;
    description: string;
    enabled: boolean;
    id: string;
    name: string;
  }[];
  timeZone: string;
  useQr: boolean;
  userId: string;
}

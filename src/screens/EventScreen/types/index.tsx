export type GuestStatus =
  | 'DRAFT'
  | 'INVITED'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'APPLIED'
  | 'REFUSED';

export interface AdditionalGuest {
  firstName: string;
  lastName: string;
  id: string;
  guestId: string;
}

export interface Vouch {
  name: string;
}

export interface EventGuest {
  id: string;
  name: string;
  status: GuestStatus;
  addedBy?: string;
  additionalGuests?: AdditionalGuest[];
  age?: number;
  baseCity?: string;
  category?: string[];
  checkIn?: boolean;
  declinedBy?: string;
  declinedByPicture?: string;
  email?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_APPLICABLE';
  interest?: string[];
  invitationSource?: string;
  isBanned?: boolean;
  isFavorite?: boolean;
  maxAdditionalGuests?: number;
  numFollowers?: string;
  partySize?: number;
  profilePicture?: string;
  questions?: Array<{ question: string; answer: string }>;
  ticketType?: string;
  userId?: string;
  vouches?: Vouch[];
  privateGuestNote?: string;
}

export interface ManageGuestPayload {
  guestStatus: GuestStatus;
  inviteMessage?: string;
  maxAdditionalGuests?: number;
  privateGuestNote?: string;
  ticketTypeId?: string;
  users?: string[];
}

export interface GuestListResponse {
  data: {
    users: EventGuest[];
    total?: number;
    confirmed?: number;
  };
  status: number;
  message?: string;
}

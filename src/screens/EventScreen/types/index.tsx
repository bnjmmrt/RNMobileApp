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
  email: string;
  idUserVouch: string;
  isApproved: boolean;
  name: string;
  picture: string;
  isVouched:boolean
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
  userId: string;
  vouches?: Vouch[];
  privateGuestNote?: string;
  phoneNumber?: string;
}

export interface ManageGuestPayload {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  exclusiveIds: string[];
  guestStatus: GuestStatus;
  currentStatus: GuestStatus;
  inclusiveIds: string[];
  inviteMessage?: string;
  isSelectedAll: boolean;
  maxAdditionalGuests?: number;
  privateGuestNote?: string;
  sendNotification: boolean;
  ticketTypeId?: string;
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

export interface Location {
    city?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

export interface Role {
    id?: string,
    name?: string
}

export interface Collaborator {
    id?: string;
    role?: Role;
    addGuestsToDrafts: boolean
    chatWithAllGuests: boolean
    chatWithGuestsByCollaborator: boolean
    checkInGuests: boolean
    companyLogo: string
    companyName: string
    displayName: string
    displayNameListEvent: boolean
    editEventDetailsSettings: boolean
    email: string
    generateEventReports: boolean
    inviteGuestsToEvent: boolean
    isFollowedByCurrentGuest: boolean
    limitInvitations: boolean
    manageDedicatedSignUpForm: boolean
    manageInAppRsvpRequests: boolean
    name: string
    postAnnouncementsByCollaborator: boolean
    postAnnouncementsToAllGuests: boolean
}

export interface Owner {
    role?: Role;
    companyLogo: string;
    companyName: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
}

interface EventType {
    description: string;
    enabled: boolean
    id: string;
    name: string;
}

interface AgeLimit {
    description: string;
    enabled: boolean
    id: string;
    maxAge: number
    minAge: number
    name: string;
}

interface TicketTypes {
    capacity: number
    description: string
    enabled: boolean
    id: string
    name: string
}

interface QuizQuestions {
    enabled: boolean
    id: string
    order: number
    question: string
    required: boolean
}



export interface Event {
    name: string;
    imageCover?: string;
    imageFlyer?: string;
    startDate: string;
    endDate: string;
    location?: Location;
    currentGuestStatus?: string;
    description?: string;
    totalCheckedInGuests?: number;
    totalConfirmedGuests?: number;
    showLocation?: boolean;
    autoPublished?: boolean;
    isPrivate?: boolean;
    useQr?: boolean;
    collaborators?: Collaborator[];
    owner?: Owner;
    limitOnePlus?: number;
    eventType?: EventType;
    ageLimit?: AgeLimit;
    ticketTypes?: TicketTypes[];
    quizQuestions?: QuizQuestions[];

}

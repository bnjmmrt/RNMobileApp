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
    collaborators?: Collaborator[]
    owner?: Owner
}

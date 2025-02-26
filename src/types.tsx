export interface Location {
    city?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

export interface Event {
    name: string;
    imageCover?: string;
    imageFlyer?: string;
    startDate: string;
    endDate: string;
    location?: Location;
    currentGuestStatus?: string;
    totalCheckedInGuests?: number;
    totalConfirmedGuests?: number;
    showLocation?: boolean;
}

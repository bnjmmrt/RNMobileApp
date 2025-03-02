export interface attachmentArrInterface {
    type: string,
    media: string,
    name: string,
    thumbnil: string
}
export interface guestUserInterface {
    firstName: string,
    lastName: string,
    profilePicture: string
}

export interface guestInterface {
    user: guestUserInterface
}

export interface RecipientListItemProps {
    item: guestInterface;
    index: number,
    isSelected: boolean;
    onSelectUser: (user: guestInterface) => void;
    showCheckbox?: boolean;
}

export interface addAnnouncementRequestInterface {
    "ticketType": string[],
    "addedBy": string[],
    "announcement": string,
    "attachments": any[],
    "recipients": any[]
}

export interface editAnnouncementRequestInterface {
    "announcement": string,
    "attachments": any[],
}
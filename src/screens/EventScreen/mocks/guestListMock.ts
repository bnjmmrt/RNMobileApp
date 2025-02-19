export type GuestStatus =
  | 'Drafts'
  | 'Requested'
  | 'Invited'
  | 'Confirmed'
  | 'Declined';

export interface GuestItem {
  id: string;
  name: string;
  avatar: string;
  status: GuestStatus;
  isVip: boolean;
  isYou: boolean;
  isHost: boolean;
  invitees?: GuestItem[];
  inviteCount?: number;
}

export const guestListMock: GuestItem[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Confirmed',
    isVip: true,
    isYou: true,
    isHost: false,
    inviteCount: 5,
    invitees: [
      {
        id: '1-1',
        name: 'James Wilson',
        avatar: 'https://i.pravatar.cc/150?img=11',
        status: 'Confirmed',
        isVip: true,
        isYou: false,
        isHost: false,
      },
      {
        id: '1-2',
        name: 'Sophia Chen',
        avatar: 'https://i.pravatar.cc/150?img=12',
        status: 'Confirmed',
        isVip: true,
        isYou: false,
        isHost: false,
      },
      {
        id: '1-3',
        name: 'Marcus Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=13',
        status: 'Confirmed',
        isVip: true,
        isYou: false,
        isHost: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Oliver Parker',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Requested',
    isVip: false,
    isYou: false,
    isHost: false,
    inviteCount: 5,
  },
  {
    id: '3',
    name: 'Isabella Martinez',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'Confirmed',
    isVip: true,
    isYou: false,
    isHost: false,
    inviteCount: 5,
    invitees: [
      {
        id: '3-1',
        name: 'Ethan Williams',
        avatar: 'https://i.pravatar.cc/150?img=31',
        status: 'Confirmed',
        isVip: true,
        isYou: false,
        isHost: false,
      },
      {
        id: '3-2',
        name: 'Ava Johnson',
        avatar: 'https://i.pravatar.cc/150?img=32',
        status: 'Confirmed',
        isVip: true,
        isYou: false,
        isHost: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Lucas Kim',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'Confirmed',
    isVip: true,
    isYou: false,
    isHost: true,
    inviteCount: 5,
    invitees: [
      {
        id: '4-1',
        name: 'Mia Patel',
        avatar: 'https://i.pravatar.cc/150?img=41',
        status: 'Confirmed',
        isVip: false,
        isYou: false,
        isHost: false,
      },
    ],
  },
  {
    id: '5',
    name: 'Sarah Anderson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'Drafts',
    isVip: true,
    isYou: false,
    isHost: false,
  },
  {
    id: '6',
    name: 'Daniel Lee',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'Drafts',
    isVip: true,
    isYou: false,
    isHost: false,
  },
  {
    id: '7',
    name: 'Olivia Taylor',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'Declined',
    isVip: false,
    isYou: false,
    isHost: false,
  },
  {
    id: '8',
    name: 'Noah Garcia',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'Declined',
    isVip: false,
    isYou: false,
    isHost: false,
  },
  {
    id: '9',
    name: 'Charlotte Brown',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'Drafts',
    isVip: true,
    isYou: false,
    isHost: false,
  },
  {
    id: '10',
    name: 'William Davis',
    avatar: 'https://i.pravatar.cc/150?img=10',
    status: 'Drafts',
    isVip: true,
    isYou: false,
    isHost: false,
  },
  {
    id: '11',
    name: 'Sofia Nguyen',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'Invited',
    isVip: true,
    isYou: false,
    isHost: false,
  },
  {
    id: '12',
    name: 'Alexander White',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'Drafts',
    isVip: true,
    isYou: false,
    isHost: false,
  },
];

import { TabItem } from 'src/component/ActiveTabBar/DynamicTabBar';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB in bytes

export const BUTTON_LABLE = {
  MAIL_SUBJECT: 'Rumor Application Verification',
  MAIL_BODY:
    "Hi Rumor Team, I'd like to verify my identity for my Rumor application.My verification code is: RUMORAPP",
  ENTER: 'Enter',
  NEXT: 'Next',
  RSVP: 'RSVP',
  APPLY_TO_BE_HOST: 'Apply to be a Host',
  GET_STARTED: 'Get Started',
  SAVE_TO_FILE: 'Save to Files',
  RESEND: 'Resend',
  SUBMTI_APPLICATION: 'Submit Application',
  UPDATE_APPLICATION: 'Update Application',
  UPDATE_RSVP: 'Update RSVP',
  UPCOMING: 'Upcoming',
  INVITED: 'Invited',
  APPLIED: 'Applied',
  PAST: 'Past',
  VIEW_EVENT: 'View Event',
  VIEW_TICKET: 'View Ticket',
  APPLY_FOR_MEMBERSHIP: 'Apply for Membership',
  GO_TO_INSTAGRAM: 'Go to Instagram',
  SEND_EMAIL: 'Send Email',
  SUPPORT_EMAIL_ID: 'support@therumor.com',
  SUBMIT: 'Submit',
  INVITE_CONTACTS_VIA: 'Invite Contacts via Link',
  INVITE: 'Invite',
  SENT: 'Sent',
  REQUREST: 'Request',
  ACCESS_MY_CONTACTS: 'Access My Contacts',
  ENTER_REFERRAL_CODE: 'Enter Referral Code',
  CONFIRM: 'Confirm',
  INVITE_FRIENDS: 'Invite Friends to Join Rumor',
  INVITES: 'Invites',
  INVITE_FREINDS: 'Invite friends to join you on Rumor.',
  REPLACE_PHOTO: 'Replace Photo',
  CANCEL: 'Cancel',
  DELETE_MY_ACCOUNT: 'Delete My Account',
  CLOSE: 'Close',
  SAVE_PHOTO: 'Save Photo',
  ALL_USERS: 'All Users',
  LISTS: 'Lists',
  OVERVIEW: 'Overview',
  EVENTS: 'Events',
  SHOW_RESULTS: 'Show Results',
  CLEAR_FILTERS: 'Clear Filters',
  FOLLOW: 'Follow',
  YES: 'Yes',
  NO: 'No',
  ADD_GUEST_DETAILS: 'Add Guest Details',
  ADD: 'Add',
  DISCOVER_MORE_EVENTS: 'Discover More Events',
  CHECK_IN: 'Check-In',
  SHOW_TICKET_BREAKDOWN: 'Show Ticket Breakdown',
  MANAGE_GUEST_LIST: 'Manage Guest List',
  SAVE_DRAFT: 'Save Draft',
  SEND_INVITE: 'Send Invite',
  APPROVE_REQUEST: 'Approve Request',
  UPDATE_INVITE: 'Update Invite',
  ADD_TO_CONFIRM: 'Add to Confirm',
  MARK_AS_SPAM: 'Mark as Spam',
  UNMARK_AS_SPAM: 'Unmark as Spam',
  PROFILE: 'Profile',
  INVITE_GUESTS: 'Invite Guests',
  INVITE_FROM_CONTACTS: 'Invite from Contacts',
  INVITE_MANUALLY: 'Invite Manually',
  CLEAR: 'Clear',
  RELOAD: 'Reload',
  DELETE: 'Delete',
  SAVE_CHANGES: 'Save Changes',
  DISCARD_CHANGES: 'Discard Changes',
} as const;

export const LABLE = {
  WELCOME: 'Welcome to Rumors!',
  RUMORAPP: 'RUMORAPP',
  ENTER_YOUR_PHONE_NUMBER: 'Enter your phone number',
  ENTER_YOUR_EMAIL: 'Enter your email',
  RUMOR_WILL_SEND_YOU_A_EMAIL_WITH_A_VERIFICATION_CODE:
    'Rumor will send you an email with a verification code.',
  RUMOR_WILL_SEND_YOU_A_TEXT_WITH_A_VERIFICATION_CODE:
    'Rumor will send you a text with a verification code.',
  EROOR_ENTER_PHONE_NUMBER: 'Please enter a phone number',
  EROOR_ENTER_VALID_PHONE_NUMBER: 'Please enter a valid phone number.',
  EROOR_ENTER_EMAIL: 'Please enter a valid email address',
  ERROR_VERIFY_CODE:
    'The code you entered cannot be verified. Please try again.',
  EROOR_ENTER_CODE: 'Please enter a verification code',
  ENTER_YOUR_VERIFICATION_CODE: 'Enter your verification code',
  SEND_TO: 'Sent to ',
  DONT_GET_CODE: "Didn't get a code?",
  ENTER_YOUR_NAME: "Let's start with your name.",
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  WHATS_YOUR_EMAIL_ADDRESS: "What's your email address?",
  WHATS_YOUR_PHONE_NUMBER: "What's your phone number?",
  WHATS_YOUR_PHONE_NUMBER_SUBTITLE:
    "We'll contact you for membership and event updates.",
  WHATS_YOUR_EMAIL_SUBTITLE:
    "We'll contact you for membership and event updates.",
  EMAIL_ADDRESS: 'Email Address',
  WHATS_YOUR_GENDER: "What's your gender?",
  SELECT_THE_OPTION_THAT_BEST_DESCRIBES_YOU:
    'Select the option that best describes you.',
  WHEN_IS_YOUR_BIRTHDAY: "When's your birthday?",
  WE_WILL_USE_THIS_INFORMATION_TO_TAILOR_YOUR_EXPERIENCE:
    "We'll use this information to tailor your experience.",
  WHERE_DO_YOU_CALL_HOME: 'Where do you call home?',
  WE_WILL_RECOMMEND_EVENTS_AND_EXPERIENCES_NEAR_YOU:
    "We'll recommend events and experiences near you.",
  WHAT_IS_YOUR_CREATIVE_OR_PROFESSIONAL_FOCUS:
    "What's your creative or professional focus?",
  YOU_CAN_CHOOSE_UP_TO_3_CATEGORIES: 'You can choose up to 3 categories',
  SEARCH_FOR_A_LOCATION: 'Search for a Location…',
  DATE_PLACEHOLDER: 'MM/DD/YYYY',
  MY_DETAILS: 'My Details',
  EMAIL: 'Email',
  VERIFY_EMAIL: 'Verify Email',
  PHONE: 'Phone',
  VERIFY_PHONE: 'Verify Phone',
  GENDER: 'Gender',
  BIRTHDAY: 'Birthday',
  BASE_CITY: 'Base City',
  CREATIVE_FOCUS: 'Creative Focus',
  INTERESTS: 'Interests',
  PROFILE_PHOTO: 'Profile Photo',
  EMAIL_VERIFICATION: 'Email Verification',
  PHONE_VERIFICATION: 'Phone Verification',
  SET_UP_YOUR_ACCOUNT: 'Set up your account',
  ACCOUNT_SETTINGS: 'Account Settings',
  IDENTITY_VERIFICATION: 'Identity Verification',
  IDENTITY_VERIFICATION_TITLE: "Last step, what's your Instagram?",
  IDENTITY_VERIFICATION_SUBTITLE: 'This helps us verify your online identity.',
  CHOOSE_YOUR_INTERESTS: 'Choose your interests',
  CHOOSE_YOUR_INTERESTS_SUBTITLE:
    "Select topics of interests so we can curate experiences\nyou'll want to attend.",
  ADD_A_PHOTO: 'Add a photo',
  ADD_A_PHOTO_SUBTITLE: 'Upload a profile photo to complete your profile.',
  CHAT_WITH_HOST: 'Connect directly\nwith hosts.',
  CHAT_WITH_GUEST: 'Chat \nwith guests.',
  SEARCH_FOR_EVENT: 'Search for an event...',
  ACCESS_THE_MOST_VALUABLE_CALENDAR:
    "Access culture's most \n coveted moments.",
  TWO_MINUTES_TO_COMPLETE: '~2 min to Complete',
  STREAMLINE_YOUR_LIFESTYLE: 'Never miss\na moment.',
  MANAGE_YOUR_EVENTS: 'All your invites, events, and passes—in one place.\n',
  CONNECT_WITH_WORLD:
    'Get discovered by hosts and invited to coveted \n moments in art, fashion, music, and beyond.',
  CONNECT_DIRECTLY_WITH_PEOPLE:
    'Build relationships and secure invites from those \n who run the show. No more barriers.',
  ENGAGE_WITH_GUESTS:
    'Engage directly with your guests. Send event details, confirm attendance, and share updates effortlessly.',
  UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS: 'Let invites \n come to you.',
  GET_DISCOVERY_BY_THE_WORLD:
    "Get discovered by the world's top event organizers and receive invites to events that matter.",
  DISCOVER_EXPERIENCES_ACROSS_ART:
    'Discover experiences across art, fashion, music, and more — listed by renowned hosts.',
  DISCOVER_EXPERIENCES_IN_ART:
    'Leverage your network to unlock off-market \n experiences from renowned hosts.',
  COMPLETE_VERIFICATION: 'Complete Verification',
  SEND_DIRECT_MSG_CODE: 'Send a direct message with the code:',
  WE_WILL_REVIEW_APP:
    "We'll review your application after we receive\nyour message.",
  EMAIL_THE_CODE: 'Email the code:',
  DONT_USE_INSTAGRAM: "Don't use Instagram?",
  REFERRAL_CODE: 'Referral Code',
  IF_YOU_HAVE_ANY_REFERRAL_CODE: 'If you have a referral code, enter it below.',
  ENTER_CODE: 'Enter Code',
  SELECT_A_REFERRAL: 'Select a Referral',
  SEARCH_FRIENDS: 'Search friends',
  FRIENDS_WHO_ARE_MEMBERS: 'Friends who are members',
  REQUEST_A_REFERRAL:
    'Request a referral from a Rumor member to boost your application.',
  CONTACTS: 'Contacts',
  INVITE_FRIENDS_TO: 'Invite friends to fast track your membership approval.',
  YOU_ARE_ON_WAITLIST: "You're on\nthe waitlist.",
  FULL_ACCESS_UNLOCK:
    'Full access will be unlocked once your application is\napproved.',
  FASTRACK_YOUR_APPLICATION: 'Want to boost your application?',
  REQUEST_REFERRAL_FROM_RUMOR: 'Request referrals from Rumor members.',
  VERIFY_YOUR_INSTAGRAM: 'Verify your Instagram.',
  INVITE_YOUR_FRIEND: 'Invite your friends to join Rumor.',
  SELECT_YOUR_BIRTHDAY_BELOW: 'Select your birthday below',
  WELCOME_NOTE_LINE_1:
    "Your application has been approved. You're now part of a private network connecting you to experiences from the world's top event organizers.",
  WELCOME_NOTE_LINE_2:
    'At Rumor, we value positivity, respect, and meaningful connections. Please take a moment to review our',
  WELCOME_NOTE_LINE_3:
    "We're excited to have you in our community and can't wait for you to explore everything Rumor has to offer.",
  LOGOUT: 'Log Out',
  COMING_SOON: 'Coming Soon…',
  OTP_VERIFIED_SUCCESSFULLY: 'OTP verified successfully!',
  SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN:
    'Something went wrong, please try again',
  INVALID_OTP: 'The code you entered cannot be verified. Please try again.',
  ABOUT_THE_EVENT: 'About the Event',
  GUEST_LIST: 'Guest List',
  FEATURE_TALENT: 'Featured Talent',
  EVENT_ANNOUNCEMENTS: 'Event Announcements',
  INITATION_MESSAGE: 'Message from Revolve',
  FURTHER_INSTRICTIONS: 'Further Instructions',
  NO_EVENT_ANNOUNCEMENTS: 'No Event Announcements',
  PAST_EVENT_ANNOUNCEMENTS_ERROR:
    "You can't post event announcements for past events.",
  PUBLISH_EVENT_ANNOUNCEMENTS_ERROR: 'Event is not published yet.',

  ADD_EVENT_ANNOUNCEMENTS_ERROR:
    "You can't post event announcements until you have confirmed guests on the guest list.",
  READ_MORE: 'Read More',
  VIEW_ALL: 'View All',
  VIEW_LESS: 'View Less',
  FEATURED_TALENT: 'Featured Talent',
  DUMMY_TEXT:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent bland',
  PHONE_NUMBER: 'Phone Number',
  RSVP_TEXT: `If you select 'No', you cannot change your response. If you later decide you'd like to attend, you'll need to request another invite from the host.`,
  WE_WERE_SORRY_CANT_MAKE_IT: "We're sorry you can't make it.",
  YOU_DECLINED_THIS_INVITATION: 'You declined this invitation',
  RSVP_QUESTION_DETAILS:
    'The host is offering you the option to bring up to [X] guests. How many guests would you like to bring?',
  RSVP_SUBTITLE:
    "If you later decide you'd like to attend, you'll need to request another invite from the host.",
  ADD_FRIEND_AS_GUEST: 'Add friends as guests',
  ADD_GUEST_SUBTITLE: 'Provide details to add your additional guest.',
  ADD_GUEST_SYNC_TEXT:
    'Easily sync your phone contacts to invite friends to join you at events.',
  SYNC_CONTACT_SEETTINGS: 'Sync Contacts in Settings',
  ADD_GUEST: 'Add Guest',
  ADD_GUSET_SUBTITLE: `Your changes will only be saved in Rumor and will not impact your device's contact list.`,
  YOUR_RSPV_IS: 'Your RSVP is confirmed!',
  YOU_CAN_RETURN_TO_THE:
    'You can return to the event page anytime for more details or to access your event confirmation.',
  WEBSITE: 'Website',
  COMPANY_NAME: 'Company Name',
  BIO: 'Bio',
  COMPANY_DESCRIPTION: 'Description of Company',
  ENTER_FEEDBACK: 'Enter Feedback',
  REQUESTS: 'Requests',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked-In',
  PROFILE: 'Profile',
  PENDING_DETAILS: 'Pending Details',
  GUEST_CHICKED_IN: 'Guest Check-In',
  STANDARD: 'Standard',
  LEAD_GUEST: 'Lead Guest',
  GUEST_NOTE: 'Guest Note',
  PLUS_1S: 'Plus 1s',
  PENDING: 'Pending',
  PLACEHOLDER_PRIVATE_NOTE: 'Add a private note. Not visible to the guest.',
  TICKET_TYPE: 'Ticket Type',
  USER_NOT_FOUND: 'User not found',
  SEARCH_USERS: 'Search Users',
  MANAGE_GUESTS: 'Manage Guests',
  USER_ALREADY_CHECKED_IN: 'User already checked-in',
  SHOW_QR_CHECKIN_MESSAGE: 'Show this QR code at event check-in',
  NEVER_MISS_MOMENT: 'Never miss a moment.\nSync this event to your calendar.',
  ADD_TO_CALENDAR: 'Add To Calendar',
  ADD_TO_APPLE_CALENDAR: 'Add to Apple Calendar',
  ADD_TO_GOOGLE_CALENDAR: 'Add to Google Calendar',
  NO_CALENDAR_FOUND: 'No calendar found on this device.',
  ACCESS_CALENDAR: 'Calendar access is required to add events.',
  PERMISSION_DENIED: 'Permission Denied',
  INVITED: 'Invited',
  CHECK_IN: 'Check-In',
  DISCOVER_MORE_EVENTS: 'Discover More Events',
  VIP_TOOLTIP_CONTENT:
    'Exclusive VIP access including VIP parking, expedited entry, backstage access, and premium viewing areas.',
  EVENT_SETTING_INFO:
    "Edit event settings on Rumor's web platform.\nClick the button below to take you there.",
  MANAGE_INVITE: 'Manage Invite',
  YOU_ARE_OFFLINE: "You're Offline",
  NOTIFICATIONS: 'Notifications',
  NO_NOTIFICATIONS_YET: 'No notifications yet',
  NOTIFICATIONS_SUB_TITLE: "We'll let you know when updates arrive!",
  PROFILE_UPDATED_SUCCESSFULLY: 'Profile Updated Successfully',
  PLEASE_SELECT_ONE: 'Please select one',
  PLEASE_SELECT_AT_LEAST_ONE: 'Please select at least one',
  SELECT_UPTO_3: 'Select up to 3',
  HOST_UNBLOCK_MESSAGE:
    'Are you sure you want to unblock this host?\nUnblocking this host will allow them to send you new event invites and chat messages.',
  I_DONT_HAVE_INSTAGRAM: " I don't have an instagram account",
};
export const EVENT = {
  EDIT_EVENT: 'Edit Event',
  DETAILS: 'Details',
  SETTINGS: 'Settings',
  EVENT_NAME: 'Event Name',
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  LOCATION: 'Location',
  FURTHER_INSTRUCTION: 'Further Instructions (optional)',
  EVENT_DESCRIPTION: 'Event Description',
  HIDE_ADDRESS: 'Hide full address for confirmed guests',
  FEATURE_TALENT: 'Featured Talent',
  TOTAL_CONFIRMED: 'Total Confirmed:',
  TOTAL_CHECKEDIN: 'Total Checked-In:',
  VISIBILITY: 'Visibility',
  EVENT_TYPE: 'Event Type',
  PLUS_1_LIMIT: 'Plus 1 Limit',
  AGE_LIMIT: 'Age Limit',
  EVENT_PUBLISH_SETTINGS: 'Event Publish Settings',
  TICKET_TYPES: 'Ticket Types',
  UTILIZE_QR_CODES_FOR_EVENT_CHECK_IN: 'Utilize QR codes for event check-in?',
  EVENT_COLLABORATORS: 'Event Collaborators',
  QUESTIONNAIRE: 'Questionnaire',
  UPDATE_SETTINGS_ON_WEB: 'Update Settings on Web',
  USER_HAS_NO_EVENTS: 'User has no events in this status',
  REPORT_SUBMITTED_SUCCESSFULLY: 'Report Submitted Successfully',
  SELECT_TICKET_TYPE: 'Select Ticket Type',
  TICKET_TYPE: 'Ticket Type',
  ADDITIONAL_GUEST: 'Additional Guest',
  INVITE_MSG: 'Invite Message',
  ADD_MSG: "Add your optional message...",
  ADD_NOTE: 'Add a private note. Not visible to the guest.',
  DIRECTLY_ADD: 'This guest will be added directly to the confirmed tab',
  BYPASS_REGISTRATION: "Want users to bypass registration?",
  ADD_DIRECTLY: "Add guests directly to the confirmed tab",
  DECLINE_REASON: 'Decline Reason',
  INVITE_DETAIL: 'Invite Details',
  GIVE_ACCESS: "Give Access",
  LOADING_CAMERA: "Loading Camera..."
};

export const PROFILE = {
  EDIT_PROFILE: 'Edit Profile',
  TRAVEL_PLANS: 'Travel Plans',
  NOTIFICATION: 'Notifications',
  FEEDBACK: 'Feedback',
  CONTACT_SUPPORT: 'Contact Support',
  DELETE_ACCOUNT: 'Delete Account',
  LOGOUT: 'Log Out',
  FOLLOWING: 'Following',
  REFERRALS: 'Referrals',
  CONNECTED_ACCOUNTS: 'Connected Accounts',
  MY_INTERESTS: 'My Interests',
  CONNECTED_ACCOUNTS_SUB_TITLE:
    'Connect your social profiles to help hosts learn more about you and unlock more opportunities.',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  TIKTOK: 'TikTok',
  LINKEDIN: 'LinkedIn',
  YOUTUBE: 'YouTube',
  X: 'X',
  SNAPCHAT: 'Snapchat',
  CONNECT_INSTAGRAM: 'Connect Instagram',
  CONNECT_TIKTOK: 'Connect TikTok',
  CONNECT_FACEBOOK: 'Connect Facebook',
  CONNECT_LINKEDIN: 'Connect LinkedIn',
  CONNECT_X: 'Connect X',
  CONNECT_YOUTUBE: 'Connect YouTube',
  CONNECT_SNAPCHAT: 'Connect Snapchat',
  MY_INTERESTS_DESC:
    "Choosing interests helps Rumor curate and recommend experiences that you'll love.",
  FEEDBACK_SUBTITLE: 'Let us know what you think of Rumor.',
  SMS_NOTIFICATIONS: 'SMS Notifications',
  PUSH_NOTIFICATIONS: 'Push Notifications',
  EMAIL_NOTIFICATIONS: 'Email Notifications',
  FEEDBACK_MESSAGE: 'Thank you for\nyour feedback!',
  FEEDBACK_CONFIRMATION_MESSAGE:
    'We truly appreciate your input and will use it to enhance our service.',
  REVIEW_REFERRAL_REQUESTS:
    'Review referral requests from friends who want to join Rumor. Your decision will remain private.',
  REVIEW_VOUCH_REQUESTS:
    'Approve or decline requests from members seeking your vouch to join an experience. Your decision is private.',
  COMPANY_NAME: 'Company Name',
  APPLY_FOR_MEMBERSHIP: 'Apply for Membership',
};

export const ERROR_MESSAGE = {
  FIRST_NAME: 'Please enter your first name',
  LAST_NAME: 'Please enter your last name',
  PLEASE_ENTER_YOUR_BASE_CITY: 'Please enter your base city',
  PLEASE_ENTER_YOUR_BIRTHDAY: 'Please enter your birthday',
  PLEASE_ENTER_EVENT_DATE: 'Please enter event date',
  PLEASE_ENTER_A_VALID_EMAIL_ADDRESS: 'Please enter a valid email address',
  PLEASE_ENTER_A_VALID_REFERRAL_CODE: 'Please enter a valid referral code',
  AGE_REQUIREMENT_NOT_MET: 'Age requirement not met',
  FEEDBACK_ERROR: 'Please enter your Feedback.',
  WEBSITE_ERROR: 'Please enter a valid URL.',
  COMPANY_NAME_ERROR: 'Company Name is required',
  TICKET_TYPE_ERROR: 'Select at least one ticket type',
  RECIPIENTS_ERROR: 'Choose at least 1 user',
  COLLABORATOR_ERROR: 'Choose a collaborator',
  ANNOUNCEMENT_DETAIL_ERROR: 'Enter announcement details',
  FILE_SIZE_EXCEED:
    'File size exceeds the 5MB limit. Please upload a smaller file.',
  SOMETHING_WENT_WRONG: 'Something went wrong, Please try again later',
  TCKET_ERROR_MESSAGE: 'Ticket is not associated with a guest for this event.',
  NO_INTERNET:
    'You’re not connected to the internet.\nPlease check your connection and try again.',
  EMPTY: '',
  FIRST_NAME_SIZE_EXCEED: 'First Name cannot exceed 30 characters',
  LAST_NAME_SIZE_EXCEED: 'Last Name cannot exceed 30 characters',
  FIRST_NAME_INVALID_CHARACTERS:
    'First Name only supports letters, numbers, space and special characters(-, $, !, @, *, &)',
  LAST_NAME_INVALID_CHARACTERS:
    'Last Name only supports letters, numbers, space and special characters(-, $, !, @, *, &)',
  INVALID_CHARACTERS:
    'Field only supports letters, numbers, space and special characters(-, $, !, @, *, &)',
  FEEDBACK_SIZE_EXCEED: 'Feedback cannot exceed 500 words',
  DESCRIPTION_SIZE_EXCEED: 'Bio cannot exceed 200 words',
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  EMAIL_REQUIRED: 'Email is required',
  PLEASE_PROVIDE_EMAIL_OR_PHONE:
    'Please provide at least one contact method: email or phone number.',
  CREATIVE_FOCUS: 'Please select at least one',
  ALREADY_PHONE: 'Phone Number already exist.',
  ALREADY_EMAIL: 'Email address already exist.',
  SOMETHING_WRONG: 'Something went wrong, please try again!',
  ENTER_USER_NAME: 'Please enter username',
  PLEASE_WAIT: 'Please wait for the upload to complete',
  UPLOAD_PHOTO: 'Please upload a Profile Photo',
  DETAIL_UPDATED: 'Details updated successfully!'
};

export const PERMISSION = {
  PERMISSION_REQUIRED: 'Permission Required',
  GALLERY_PERMISSION: 'We need access to your photo library to allow you to add a profile picture. Please enable photo library permissions in your device settings.',
  OPEN_SETTING: "Open Settings",
  CAMER_REQUIRED: "Camera permission is required",
  CAMERA_PERMISSION: 'We need access to your camera to allow you to scan. Please enable camera permissions in your device settings.'
}
export const COLORS = {
  black: '#1F1F1F',
  black2: '#0F0F0F',
  white: '#FFFFFF',
  light_gray: '#838282',
  light_text: '#B5B5B5',
  dark_gray: '#494949',
  lighter_gray: '#EEEEEE',
  disable: '#D7D3D0',
  borderGray: '#E1E1E1',
  tabBorderColor: '#D8D8D8',
  text: '#B5B5B5',
  errorText: '#9D0D11',
  bgBackArrow: '#f4f4f4',
  transperantBackground: 'rgba(0, 0, 0, 0.5)',
  placeHodler: '#A2A1A1',
  surfaceSecondary: '#CDBAB1',
  nearBlack: '#676767',
  borderYellow: '#FBE8BD',
  bgYellow: '#FEF8E9',
  borderBlue: '#B9D8CF',
  bgBlue: '#E7F1F5',
  borderRed: '#E2B6B8',
  bgRed: '#F5E7E7',
  borderGreen: '#B9D8CF',
  bgGreen: '#E8F2EF',
  successLight: '#E8F2EF',
  success: '#167E60',
  pink: '#D93175',
  blue: '#1877F2',
  darkBlue: '#0A66C2',
  red: '#FF0000',
  yellow: '#FFFC00',
  yellowLight: '#FEF8E9',
  yellowDark: '#D9A21F',
  grayMiddle: '#000000BF',
  blueLocation: '#007AFF',
  whiteFeedContainer: '#F1F1F1',
  grayFeed: '#222222',
  grayFeedLocation1: '#00000033',
  grayFeedLocation2: '#E0E0E0FA',
  grayFeedLocation3: '#54545657',
  blueDark: '#0D729D',
  LIGHT: 'LIGHT',
  DARK: 'DARK',

  neutral_disabled: '#9C9C9C',
  neutral_surface: '#D8D8D8',
  yellowbackground: '#F1B422',
  neutralBorder: '#E1E3E6',
  borderBlur: '#BFBFBF',
  bgGray: '#EAEAEA',
  webBlack: '#181818',
  surface_disabled_icon: '#464646',
};

export const EVENT_STATUS = {
  AWAITING: 'Awaiting response from host',
  INVITED: 'Invited by host',
  DECLINED_BY_HOST: 'Request declined by host',
  DECLINED_BY_YOU: 'You declined this invitation',
  GOING: 'You are going',
};

export enum EventStatusEnum {
  NO_EVENT = 'NO_EVENT_STATUS',
  APPROVED = 'APPROVED_STATUS',
  DRAFT = 'DRAFT_STATUS',
  PENDING = 'PENDING_STATUS',
  DECLINED = 'DECLINED_STATUS',
  SCHEDULED = 'SCHEDULED_STATUS',
  UPCOMING = 'UPCOMING_STATUS',
  PAST = 'PAST_STATUS',
  ARCHIVED = 'ARCHIVED_STATUS',
  CANCELLED = 'CANCELLED_STATUS',
  UNRECOGNIZED = 'UNRECOGNIZED',
}


export const memberTabData: TabItem[] = [
  {
    id: '1',
    label: BUTTON_LABLE.UPCOMING,
    title: 'No Events Here',
    subTitle: 'No upcoming events.',
  },
  {
    id: '2',
    label: BUTTON_LABLE.INVITED,
    title: 'No Events Here',
    subTitle: 'No invitations yet.',
  },
  {
    id: '3',
    label: BUTTON_LABLE.APPLIED,
    title: 'No Events Here',
    subTitle: "You haven't applied to any events yet.",
  },
  {
    id: '4',
    label: BUTTON_LABLE.PAST,
    title: 'No Events Here',
    subTitle: 'No past events.',
  },
];

export const ROLE = {
  MEMBER: 'member',
  NON_MEMBER: 'non_member',
  HOST: 'host',
  CAP_MEMBER: 'Member',
  CAP_NON_MEMBER: 'Non-Member',
};
export const hostTabData: TabItem[] = [
  {
    id: '1',
    label: BUTTON_LABLE.UPCOMING,
    title: 'No Events Here',
    subTitle: 'No upcoming events',
  },
  {
    id: '2',
    label: BUTTON_LABLE.PAST,
    title: 'No Events Here',
    subTitle: 'No past events.',
  },
];

export const editEventsTab: TabItem[] = [
  {
    id: '1',
    label: EVENT.DETAILS,
    title: '',
    subTitle: '.',
  },
  {
    id: '2',
    label: EVENT.SETTINGS,
    title: '',
    subTitle: '',
  },
];
export const StatusEnum = {
  NO_STATUS: 0,
  DRAFT: 1,
  INVITED: 2,
  CONFIRMED: 3,
  DECLINED: 4,
  REJECTED: 9,
  APPLIED: 5,
  REFUSED: 6,
  REVIEW: 7,
  UNRECOGNIZED: -1,
};

// Function to get the status number
// Function to get the status number
export const getStatusNumber = (status: string): number => {
  return StatusEnum[status as keyof typeof StatusEnum] ?? StatusEnum.NO_STATUS;
};

export const genderList = [
  { id: 'MALE', gender: 'Male' },
  { id: 'FEMALE', gender: 'Female' },
  { id: 'NON_BINARY', gender: 'Non-binary' },
  { id: 'UNRECOGNIZED', gender: 'Prefer not to say' },
];

export const ANNOUNCEMENT = {
  New_Announcement: 'New Announcement',
  Edit_Announcement: 'Edit Announcement',
  Recipient_Details: 'Recipient Details',
  Announcement_Description:
    'Confirmed guests will receive the post via email, SMS and in-app notification. It will also be shown on the event page.',
  Ticket_Type: 'Ticket Type',
  Added_by: 'Added by',
  Send_to: 'Send to:',
  Announcement_Details: 'Announcement Details',
  Announcement: 'Announcement',
  Share_updates: 'Share updates or important event details...',
  Attachments: 'Attachments',
  Attachments_Descripiton:
    'Upload up to 3 files. Allowed File types: JPEG, PNG, PDF.  Max file size: 5 MB.  ',
  Post_Announcement: 'Post Announcement',
  Choose_Document: 'Choose Document',
  Choose_from_file: 'Choose from file',
  Choose_photo_or_video: 'Choose photo',
  ADD_ATTACHMENT: 'ADD ATTACHMENT',
  ANNOUNCEMENT_TICKET_TOOLTIP:
    'Include only confirmed guests with the selected ticket types.',
  ANNOUNCEMENT_TOOLTIP:
    'Your selection will filter recipients by the host or event collaborator that added them to the guest list.',
  POSTED_BY: 'Posted by',
  CANCEL: 'Cancel',
  Recipients: 'Recipients',
  No_results: 'No results',
  No_Recipients: 'No recipients',
  Please_refine_your_search: 'Please refine your search.',
  Choose_Photo: 'Choose Photo',
  READ_MORE: 'Read more',
  READ_LESS: 'Show less',
  Delete: 'Delete',
  Update_Announcement: 'Update Announcement',
  Update_Event_Announcement: 'Update Event Announcement',
  update_text:
    'Are you sure you want to update this announcement? Changes will be reflected in the event page.',
  Delete_Event_Announcement: 'Delete Event Announcement',
  delete_text:
    'Are you sure you want to remove this announcement from the event page?',
  leave_title: 'Are you sure you want to leave? ',
  leave_text:
    'You have unsaved changes. Are you sure you want to leave without saving?',
  announcement_des: 'Announcements will be sent immediately to ',
  Leave_Without_Saving: 'Leave Without Saving',
  Announcement_posted: 'Event announcement posted',
  Announcement_deleted: `Event announcement deleted`,
  Announcement_updated: `Event announcement updated`
};

export const COMMUNITY_GUIDELINE = {
  description_1: 'Rumor experiences are intended exclusively for our community. Screenshotting private content from Rumor is strictly prohibited.',
  description_2: 'Our community thrives on mutual respect—please be mindful of your interactions and conduct yourself responsibly with other guests, hosts, and staff at events.',
  description_3: 'RSVP with intent. If your plans change, update your RSVP promptly to respect hosts and other members.',
  description: "We are committed to fostering a community built on respect, privacy, and meaningful connections. By using Rumor, you agree to uphold the following principles:"
};

export const HOST_COMMUNITY_GUIDELINE = {
  description_1:
    'Protect member privacy—never share personal information without consent.',
  description_2:
    'Treat users with kindness—harassment and discrimination will not be tolerated.',
  description_3:
    'Provide accurate and honest event details. Events that promote harmful or illegal activities, inappropriate language, or offensive content will be removed.',
  description:
    'You’re now part of a private network of top event organizers and cultural insiders. By using Rumor, you agree to uphold the following principles:',
};

export const base64RumorLogo = `data:image/png;base64,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`;

export const SOCIAL_LINKS = {
  Instagram: 'https://www.instagram.com/',
  LinkedIn: 'https://www.linkedin.com/',
  Facebook: 'https://www.facebook.com/',
  YouTube: 'https://www.youtube.com/',
  TikTok: 'https://www.tiktok.com/',
  X: 'https://twitter.com/'
}
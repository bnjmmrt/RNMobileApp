interface ApiConfig {
  [key: string]: {
    api: string;
  };
}

const apiConfig: ApiConfig = {
  production: {
    api: 'https://dev.api.therumor.com/v1',
  },
};

const apiSetup: keyof ApiConfig = 'production';

export const settings = {
  apiUrl: apiConfig[apiSetup].api,
  version: '1.0',
  build: '0',
};

export const apiMethod = {
  get: 'get',
  post: 'post',
  delete: 'delete',
  update: 'update',
  put: 'put',
} as const;

export type ApiMethod = keyof typeof apiMethod;

export const statusCode = {
  BadRequest: 400, // (Bad Request)
  Unauthorized: 401, // (Unauthorized)
  Successful: 201, // (OK)
  Undefined: 422,
} as const;

export type StatusCode = keyof typeof statusCode;

// https://dev.api.therumor.com/v1/communication/send-verification-code

export const EndPoint = {
  signUp: '/program-management/api/auth/signup',
  signUp2FaVerify: '/program-management/api/auth/2fa/verify',
  signUpProfileSetUp: '/program-management/api/auth/signup/profile-setup',
  login: '/program-management/api/auth/app/login',
  login2FaVerify: '/program-management/api/auth/login/2fa/verify',
  resendOtp: 'v1/communication/send-verification-code',
  verifyOtp: 'v1/program-management/api/auth/resend-otp',
  forgetPassword: '/program-management/api/auth/forgot-password',
  resetPassword: '/program-management/api/auth/reset-password',
  socialLogin: '/program-management/api/auth/social-sign-up',
  get_focuses: 'v1/platform/get-focuses',
  interests: 'v1/platform/interests',
  member_signUp: 'v1/auth/member-sign-up',
  file_upload: 'v1/files/upload',
  check_member_logiin: 'v1/auth/check-member-login',
  email_send_verification_code: 'v1/auth/send-verification-code-by-email',
  email_verify_code: 'v1/auth/verify-code-by-email',
  phone_send_verification_code: 'v1/communication/send-verification-code',
  phone_verify_code: 'v1/communication/verify-code',
  host_feedback: 'v1/auth/host-feedback',
  user_profile_picture: 'v1/auth/user-profile-picture/',
  user_profile: 'v1/auth/user-profile/',
  user_settings: 'v1/auth/user-settings/',
  user_interests: 'v1/platform/user-interests/',
  get_user_status: 'v1/auth/get-user-with-roles-by-id',

  users_list: 'v1/auth/users-list',
  create_user: 'v1/auth/create-user',
  user: 'v1/auth/user/',
  current_user: 'v1/auth/current-user',
  get_user_with_role_by_id: 'v1/auth/get-user-with-roles-by-id',
  profile_notification_settings: 'v1/auth/profile-notification-settings/',
  view_image: 'v1/files/view/',

  hosts: 'v1/auth/hosts',
  host: 'v1/auth/host',
  hosts_custom_lists: 'v1/auth/hosts/custom-lists',
  hosts_favorites_lists: 'v1/auth/hosts/favorites',
  hosts_followers_lists: 'v1/auth/hosts/followers',
  custom_lists_duplicate: 'v1/auth/hosts/custom-lists/duplicate',
  host_custom_lists: 'v1/auth/host/custom-lists',
  hosts_followed: 'v1/auth/hosts-followed/',
  referral_requests: 'v1/platform/referral-requests',
  vouch_requests: 'v1/platform/vouch-requests',
  validate_qr: 'v1/events/guest/ticket/validate',
  event_guest_details: 'v1/events/guest-details/',
  events: 'v1/events',
  generate_ticket: 'v1/events/guest/ticket/',
  get_user_with_role_by_email: 'v1/auth/get-user-with-roles-by-email',
  edit_event: 'v1/events/event/',
  check_phone: 'v1/auth/check-phone-number',
  check_email: 'v1/auth/check-email',
  event_manage_guests:'v1/events/manage-guests'
} as const;

export type EndPointKey = keyof typeof EndPoint;

export const TagKey = {
  IsBearerToken: 'IsBearerToken',
};

export default settings;

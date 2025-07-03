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

export const API_VERSION_V1 = 'v1';

export const API_USERS_V1 = `users/${API_VERSION_V1}`;
export const API_USERS_V1_AUTH = `${API_USERS_V1}/auth`;
export const API_USERS_V1_AUTH_HOSTS = `${API_USERS_V1_AUTH}/hosts`;
export const API_USERS_V1_AUTH_HOST = `${API_USERS_V1_AUTH}/host`;
// https://dev.api.therumor.com/v1/communication/send-verification-code

export const EndPoint = {
  signUp: `/program-management/api/auth/signup`,
  signUp2FaVerify: `/program-management/api/auth/2fa/verify`,
  signUpProfileSetUp: `/program-management/api/auth/signup/profile-setup`,
  login: `/program-management/api/auth/app/login`,
  login2FaVerify: `/program-management/api/auth/login/2fa/verify`,
  resendOtp: `notifications/v1/communication/send-verification-code`,
  verifyOtp: `v1/program-management/api/auth/resend-otp`,
  forgetPassword: `/program-management/api/auth/forgot-password`,
  resetPassword: `/program-management/api/auth/reset-password`,
  socialLogin: `/program-management/api/auth/social-sign-up`,

  phone_send_verification_code: `notifications/v1/communication/send-verification-code`,
  phone_verify_code: `notifications/v1/communication/verify-code`,
  notification_count: `notifications/v1/notifications/summary`,
  get_focuses: `${API_USERS_V1_AUTH}/get-focuses`,
  interests: `${API_USERS_V1_AUTH}/interests`,
  member_signUp: `${API_USERS_V1_AUTH}/member-sign-up`,
  member_logout: `${API_USERS_V1_AUTH}/logout`,
  check_member_logiin: `${API_USERS_V1_AUTH}/check-member-login`,
  email_send_verification_code: `${API_USERS_V1_AUTH}/send-verification-code-by-email`,
  email_verify_code: `${API_USERS_V1_AUTH}/verify-code-by-email`,
  host_feedback: `${API_USERS_V1_AUTH}/host-feedback`,
  user_profile_picture: `${API_USERS_V1_AUTH}/user-profile-picture/`,
  user_profile: `${API_USERS_V1_AUTH}/user-profile/`,
  user_settings: `${API_USERS_V1_AUTH}/user-settings/`,
  hosts_custom_lists: `${API_USERS_V1_AUTH}/hosts/custom-lists`,
  hosts_favorites_lists: `${API_USERS_V1_AUTH}/hosts/favorites`,
  hosts_followers_lists: `${API_USERS_V1_AUTH}/hosts/followers`,
  custom_lists_duplicate: `${API_USERS_V1_AUTH}/hosts/custom-lists/duplicate`,
  host_custom_lists: `${API_USERS_V1_AUTH}/host/custom-lists`,
  get_user_status: `${API_USERS_V1_AUTH}/get-user-with-roles-by-id`,
  users_list: `${API_USERS_V1_AUTH}/users-list`,
  create_user: `${API_USERS_V1_AUTH}/create-user`,
  user: `${API_USERS_V1_AUTH}/user`,
  get_user_with_role_by_id: `${API_USERS_V1_AUTH}/get-user-with-roles-by-id`,
  profile_notification_settings: `${API_USERS_V1_AUTH}/profile-notification-settings/`,

  view_image: `users/v1/files/view/`,
  host_ep: 'users/v1/host/profile',
  host: 'users/v1/auth/host',
  hosts_followed: 'users/v1/auth/hosts-followed/',
  referral_requests: 'users/v1/auth/referral-requests',
  check_phone: 'users/v1/auth/check-phone-number',
  check_email: 'users/v1/auth/check-email',
  switch_profile: 'users/v1/auth/switch-profile',
  noti_detail: '/notifications/v1/notification',
  file_upload: `users/v1/files/upload`,
  generate_upload_url: `users/v1/files/generate-upload-url`,
  user_interests: 'users/v1/auth/user-interests/',
  user_notification_preferences: `users/v1/notification-preferences`,

  get_user_with_role_by_email: 'users/v1/auth/get-user-with-roles-by-email',
  get_user_with_role_by_phone: 'users/v1/auth/get-user-with-roles-by-phone',

  event_manage_guests: 'events/v1/events/manage-guests',
  event_guest_details: 'events/v1/events/guest-details/',

  vouch_requests: 'events/v1/events/vouch-requests',
  validate_qr: 'events/v1/guest/ticket/validate',
  events_events: 'events/v1/events',
  generate_ticket: 'events/v1/guest/ticket/',
  edit_event: 'events/v1/event/',
  travel_plans: 'events/v1/surveys',
  travel_plans_page: 'events/v1/surveys/page',
  get_industry_categories: '/users/v1/industries/categories',
} as const;

export type EndPointKey = keyof typeof EndPoint;

export const TagKey = {
  IsBearerToken: 'IsBearerToken',
};

export default settings;

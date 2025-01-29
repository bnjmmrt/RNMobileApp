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
  file_upload:'v1/files/upload',
  check_member_logiin:'v1/auth/check-member-login',
  email_send_verification_code:'v1/auth/send-verification-code-by-email',
  email_verify_code:'v1/auth/verify-code-by-email',
  phone_send_verification_code:'v1/communication/send-verification-code',
  phone_verify_code: 'v1/communication/verify-code',
  host_feedback:'v1/auth/host-feedback',
  user_profile_picture:'v1/auth/user-profile-picture/',
  user_profile:'v1/auth/user-profile/'
} as const;

export type EndPointKey = keyof typeof EndPoint;

export const TagKey = {
  IsBearerToken: 'IsBearerToken',
};

export default settings;

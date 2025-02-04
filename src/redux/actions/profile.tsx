import { Dispatch } from 'redux';
import { apiPost } from '../../ApiManager/MainApi';
import {
  SIGNUP_PROFILE_SETUP_ERROR,
  SIGNUP_PROFILE_SETUP_REQUEST,
  SIGNUP_PROFILE_SETUP_SUCCESS,
} from '../types';
import { ProfileAction, SignUpProfileSetupFailureAction, SignUpProfileSetupRequestAction, SignUpProfileSetupSuccessAction } from '../interfaces/profileInterfaces';

// Action creators
export const fetchProfileSetupRequest = (): SignUpProfileSetupRequestAction => ({
  type: SIGNUP_PROFILE_SETUP_REQUEST,
});

export const fetchProfileSetupSuccess = (data: any): SignUpProfileSetupSuccessAction => ({
  type: SIGNUP_PROFILE_SETUP_SUCCESS,
  data,
});

export const fetchProfileSetupFailure = (error: any): SignUpProfileSetupFailureAction => ({
  type: SIGNUP_PROFILE_SETUP_ERROR,
  error,
});

//********  auth signup action called from EmailSignUpScreen ********//
export const signupProfileSetup =
  (endPoint: string, formData: Record<string, any>) =>
    async (dispatch: Dispatch<ProfileAction>): Promise<any> => {
      dispatch(fetchProfileSetupRequest());
      console.log("endPoint", endPoint);
      console.log("formData", formData);
      try {
        const data = await apiPost(endPoint, formData);
        dispatch(fetchProfileSetupSuccess(data));
        console.log('profile setup data response success:', data);

        if (data) {
          try {
            console.log('auth signup profile setup response data:', data);
          } catch (error) {
            console.error('Error during additional operations:', error);
          }
        }
        return data ?? null;
      } catch (error: any) {
        console.error('Auth SignUp profile setup error:', error);
        dispatch(fetchProfileSetupFailure(error));
        throw error;
      }
    };


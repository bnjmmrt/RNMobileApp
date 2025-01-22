import {useMemberSignUpMutation} from '../actions/appFlowApiAction';
import {FlashMessageComponent} from '../../component/FlashMessageComponent/FlashMessageComponent';

export interface UserProfile {
    address: {
      address: string;
      placeId: string;
    };
    dateOfBirth: string;
    email: string;
    facebookAccessToken: string;
    firstName: string;
    focusIds: string[];
    gender: number; 
    instagramAccessToken: string;
    instagramUserName: string;
    lastName: string;
    linkedInAccessToken: string;
    phoneNumber: string;
    platform: string;
    socialUrl: string;
  }
  
export const useMemberSignUp = () => {
  const [memberSignUp, { error, isLoading }] = useMemberSignUpMutation();

  const signUp = async (requestParam: UserProfile) => {
    try {
      // const requestParam = { email, phoneNumber: phone };
      const response = await memberSignUp(requestParam).unwrap();

      if (response.status === 200) {
        FlashMessageComponent.show('success', 'OTP resent successfully!');
      }
    } catch (error) {
      FlashMessageComponent.show(
        'error',
        'Something went wrong, please try again!',
      );
      console.error('Error:', error);
    }
  };

  return {signUp,error,isLoading};
};

import { useState } from 'react';
import { useMemberLoginMutation } from '../../redux/actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import { LABLE } from 'src/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { normalizeEmail, removeSpaceFromStr } from 'src/utils/functions';

export const useVerifyOtp = (
  isMemberExist: boolean,
  isGuest: boolean,
  email?: string,
  phone?: string,
  isEmail?: boolean,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [memberLogin] = useMemberLoginMutation();
  const [error, setError] = useState('');
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const deviceId = useSelector((state: RootState) => state.auth.deviceId);
  console.log('fcmToken', fcmToken);
  console.log('deviceId', deviceId);

  const verifyOtp = async (code: string, onSuccess: (data: any) => void) => {
    try {
      setError('');
      setIsLoading(true);
      const requestParam = {
        email:normalizeEmail(email),
        phoneNumber: removeSpaceFromStr(phone),
        code,
        isExist: isMemberExist,
        isGuest: isGuest,
        fcmToken: fcmToken,
        deviceId: deviceId
      };
      const response = await memberLogin(requestParam).unwrap();

      if (response.success) {
        const data = { ...response.data, varifyStatus: isEmail ? 1 : 2 };
        onSuccess(data);
      }
    } catch (error) {
      setError(LABLE.ERROR_VERIFY_CODE);
      // FlashMessageComponent.show('error', error?.data?.error?.message);
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyOtp, isLoading, error };
};

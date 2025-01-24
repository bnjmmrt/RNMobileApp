import { useState } from 'react';
import { useMemberLoginMutation } from '../../redux/actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';

export const useVerifyOtp = (isMemberExist: boolean, email?: string, phone?: string, isEmail?: boolean) => {
    const [isLoading, setIsLoading] = useState(false);
    const [memberLogin] = useMemberLoginMutation();

    const verifyOtp = async (code: string, onSuccess: (data: any) => void) => {
        try {
            setIsLoading(true);
            const requestParam = { email, phoneNumber: phone, code, isExist: isMemberExist };
            const response = await memberLogin(requestParam).unwrap();

            if (response.status === 200) {
                const data = { ...response.data, varifyStatus: isEmail ? 1 : 2, isInvited: email == 'sayyedshahbaz.ali@techalchemy.com'  };
                onSuccess(data);
            }
        } catch (error) {
            FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            console.error('Error verifying OTP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { verifyOtp, isLoading };
};

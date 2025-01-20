import { useState } from 'react';
import { useCheckMemberLoginMutation } from '../../redux/actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';

export const useSendOtp = (email?: string, phone?: string) => {
    const [checkMemberLogin] = useCheckMemberLoginMutation();
    const [isMemberExist, setMemberExist] = useState(false);

    const sendOtp = async (isResend: boolean) => {
        try {
            const requestParam = { email, phoneNumber: phone };
            const response = await checkMemberLogin(requestParam).unwrap();

            if (response.status === 200) {
                setMemberExist(response?.data?.isValid);
                isResend && FlashMessageComponent.show('success', 'OTP resent successfully!');
            }
        } catch (error) {
            FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            console.error('Error sending OTP:', error);
        }
    };

    return { sendOtp, isMemberExist };
};

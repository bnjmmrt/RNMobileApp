import { useState } from 'react';
import { useCheckMemberLoginMutation } from '../../redux/actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import { useDispatch } from 'react-redux';
import { setIsGuest } from '../slices/authSlice';

export const useSendOtp = (email?: string, phone?: string) => {
    const [checkMemberLogin] = useCheckMemberLoginMutation();
    const [isMemberExist, setMemberExist] = useState(false);
    const [isGuest, setGuest] = useState(false);
    const dispatch = useDispatch()
    const sendOtp = async (isResend: boolean) => {
        try {
            const requestParam = { email, phoneNumber: phone };
            const response = await checkMemberLogin(requestParam).unwrap();

            if (response.success) {
                setMemberExist(response?.data?.isValid);
                setGuest(response?.data?.isGuest || false)
                dispatch(setIsGuest(response?.data?.isGuest || false))
                isResend && FlashMessageComponent.show('success', 'OTP resent successfully!');
            }
        } catch (error) {
            FlashMessageComponent.show('error', 'Something went wrong, please try again!');
            console.error('Error sending OTP:', error);
        }
    };

    return { sendOtp, isMemberExist, isGuest };
};

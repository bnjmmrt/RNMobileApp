import React, { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import OTPComponent from '../../component/OTPComponent/OTPComponent';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useCheckMemberLoginMutation, useMemberLoginMutation } from '../../redux/actions/loginApiAction';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import FullScreenLoader from '../../component/FullScreenLoader';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { setLoginData } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

type VerifyOtpScreenProps = NativeStackScreenProps<any, any>;

type RouteParams = {
    params: {
        isEmail: boolean;
        email?: string;
        phone?: string;
    };
};

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
    const styles = VerifyOtpStyles();
    const otpInputRef = useRef<{ handleNextPress: () => void, showInvalidCodeError: (message: string) => void }>(null);
    const route = useRoute<RouteProp<RouteParams>>();
    const [sendToId, setSendToId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMemberExist, setMemberExist] = useState<boolean>(false);
    const [checkMemberLogin] = useCheckMemberLoginMutation();
    const [memberLogin] = useMemberLoginMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        const sendTo = route.params.isEmail ? route.params.email : route.params.phone;
        setSendToId(sendTo || '');
        sendTo && sendOtp(false)
    }, [route.params]);

    const onNextClick = () => {
        otpInputRef.current?.handleNextPress();
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const sendOtp = async (isResend: boolean) => {
        try {
            const requestParam = {
                email: route.params.email,
                phoneNumber: route.params.phone
            }
            const response = await checkMemberLogin(requestParam).unwrap();
            if (response.status == 200) {
                setMemberExist(response?.data?.isValid)
            }
            isResend && FlashMessageComponent.show('success', 'OTP resent successfully!');

        } catch (error) {
            FlashMessageComponent.show('error', "Something went wrong, please try again!!");
            console.error('Error creating resource:', error);
        }
    };

    const verifyOtp = async (code: string) => {
        try {

            const requestParam = {
                email: route.params.email,
                phoneNumber: route.params.phone,
                code: code,
                isExist: isMemberExist
            }
            setIsLoading(true)
            const response = await memberLogin(requestParam).unwrap();
            if (response.status == 200) {
                const data = {
                    ...response.data,
                    varifyStatus: route.params.isEmail ? 1 : 2
                }
                redirectToHome(data)
            }

            setIsLoading(false)


        } catch (error) {
            setIsLoading(false)
            FlashMessageComponent.show('error', "Something went wrong, please try again!!");
            console.error('Error creating resource:', error);
        }
    };


    const redirectToHome = (data: any) => {
        dispatch(setLoginData(data))
        navigation.navigate("AppStack")
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <FullScreenLoader loading={isLoading}>
                <SafeAreaView style={styles.container}>
                    <BackButton onPress={handleBackPress} />
                    <View style={styles.contentContainer}>
                        <TitleSubtitle title={LABLE.ENTER_YOUR_VERIFICATION_CODE} subTitle={`${LABLE.SEND_TO}${sendToId}`} />
                        <OTPComponent
                            ref={otpInputRef}
                            performCodeVerification={verifyOtp}
                            resendVerificationCode={sendOtp}
                        />
                        <View style={styles.spacer} />
                        <Button
                            disabled={false}
                            style={styles.btnStyle}
                            title={BUTTON_LABLE.GET_STARTED}
                            colorTheme="dark"
                            onPress={onNextClick}
                        />
                    </View>
                </SafeAreaView>
            </FullScreenLoader>
        </KeyboardAvoidingView>
    );
};

export default VerifyOtpScreen;

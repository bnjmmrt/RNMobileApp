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
import { resendOTP, verifyOTP } from '../..//redux/actions/login';
import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import FullScreenLoader from '../../component/FullScreenLoader';

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
    const otpInputRef = useRef<{ handleNextPress: () => void , showInvalidCodeError: (message: string) => void }>(null);
    const route = useRoute<RouteProp<RouteParams>>();
    const [sendToId, setSendToId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const sendTo = route.params.isEmail ? route.params.email : route.params.phone;
        setSendToId(sendTo || '');
        if(sendTo){
            // resendVerificationCode()
        }
    }, [route.params]);

    const onNextClick = () => {
        otpInputRef.current?.handleNextPress();
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const verifyCode = async (code: string) => {

        const requestParam = {
            ...(route.params.isEmail ? { email: route.params.email } : { phoneNumber: route.params.phone }),
            requestCode: code,
        };
        console.log("sayyed params:",requestParam)
        
        try {
            setIsLoading(true)
            setTimeout(()=>{
                setIsLoading(false)
                otpInputRef.current?.showInvalidCodeError(LABLE.ERROR_VERIFY_CODE);
            },1000)
            // const response = await verifyOTP({ code });
            // if (response) {
            //     console.log('OTP Verified Successfully:', response);
            // } else {
            //      otpInputRef.current?.showInvalidCodeError("OTP verification failed");
            //     console.error('No response received or OTP verification failed.');
            // }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        } finally{
            // setIsLoading(false)
        }
    };

    const resendVerificationCode = async () => {
        const requestParam = route.params.isEmail ?{email : route.params.email } : {phoneNumber : route.params.phone } ; 
        FlashMessageComponent.show('success', 'OTP resent successfully!');

        // try {
        //     const response = await resendOTP({requestParam});
        //     if (response) {
        //         FlashMessageComponent.show('success', 'OTP resent successfully!');
        //     } else {
        //         FlashMessageComponent.show('error', 'Failed to resend OTP.');
        //     }
        // } catch (error) {
        //     console.error('Error resending OTP:', error);
        // }
    };
    
    const checkMember = async () => {
        const requestParam = route.params.isEmail ?{email : route.params.email } : {phoneNumber : route.params.phone } ; 
        try {
            const response = await resendOTP({requestParam});
            if (response) {
                FlashMessageComponent.show('success', 'OTP resent successfully!');
            } else {
                FlashMessageComponent.show('error', 'Failed to resend OTP.');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <FullScreenLoader loading={isLoading}>
                <SafeAreaView style={styles.container}>
                    <BackButton onPress={handleBackPress} />
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{LABLE.ENTER_YOUR_VERIFICATION_CODE}</Text>
                        <Text style={styles.subtitle}>{`${LABLE.SEND_TO}${sendToId}`}</Text>
                        <OTPComponent
                            ref={otpInputRef}
                            performCodeVerification={verifyCode}
                            resendVerificationCode={resendVerificationCode}
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

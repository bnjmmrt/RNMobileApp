import React, { useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import OTPComponent from '../../component/OTPComponent/OTPComponent';
import { useRoute, RouteProp } from '@react-navigation/native';
import { setAuthToken, setLoginData } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import FullScreenLoader from '../../component/FullScreenLoader';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { useSendOtp } from '../../redux//hooks/useSendOtp';
import { useVerifyOtp } from '../../redux/hooks/useVerifyOtp';
import { setEmail, setPhone } from 'src/redux/slices/appFlowSlice';

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
    const otpInputRef = useRef<{ handleNextPress: () => void }>(null);
    const route = useRoute<RouteProp<RouteParams>>();
    const { sendOtp, isMemberExist, isGuest } = useSendOtp(route.params.email, route.params.phone);
    const { verifyOtp, isLoading } = useVerifyOtp(isMemberExist, isGuest, route.params.email, route.params.phone, route.params.isEmail);
    const dispatch = useDispatch();

    useEffect(() => {
        const sendTo = route.params.isEmail ? route.params.email : route.params.phone;
        sendTo && sendOtp(false);
    }, [route.params]);

    const onNextClick = () => otpInputRef.current?.handleNextPress();
    const handleBackPress = () => navigation.goBack();

    const redirectToHome = (data: any) => {
        dispatch(setLoginData(data));
        dispatch(setAuthToken(data?.token || ''))
        dispatch(setEmail(route.params.email || ''));
        dispatch(setPhone(route.params.phone || ''));
        const userRole = data.roles[0]?.roleName
        console.log("Sayyed userRole:", userRole)
        if (userRole == 'non_member') {
            console.log("Sayyed userRole:", "1")

            if (data.isSignUpCompleted || data.token.length > 0) {
                console.log("Sayyed userRole:", "2")

                navigation.navigate('BottomTabBar');
            } else {
                data?.isInvited ? navigation.navigate('BottomTabBar') :
                    navigation.navigate('BeforeAppStaticScreen');
            }
        } else {
            console.log("Sayyed userRole:", "3")

            navigation.navigate('BottomTabBar');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <FullScreenLoader loading={isLoading}>
                <SafeAreaView style={styles.container}>
                    <BackButton onPress={handleBackPress} />
                    <View style={styles.contentContainer}>
                        <TitleSubtitle title={LABLE.ENTER_YOUR_VERIFICATION_CODE} subTitle={`${LABLE.SEND_TO}${route.params.isEmail ? route.params.email : route.params.phone}`} />
                        <OTPComponent
                            ref={otpInputRef}
                            performCodeVerification={(code: string) => verifyOtp(code, redirectToHome)}
                            resendVerificationCode={() => sendOtp(true)}
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

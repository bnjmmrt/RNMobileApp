import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import OTPComponent from '../../../component/OTPComponent/OTPComponent';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FlashMessageComponent } from '../../../component/FlashMessageComponent/FlashMessageComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setPageProgress } from '../../../redux/slices/appFlowSlice';
import { RootState } from '../../../redux/slices';

interface VerifyOtpScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: {
    isEmail: boolean;
    email?: string;
    phone?: string;
  };
};

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = VerifyOtpStyles();
  const isEmailVerified = useSelector((state: RootState) => state.appFlow.phone);
  const otpInputRef = useRef<{ handleNextPress: () => void, showInvalidCodeError: (message: string) => void }>(null);
  const route = useRoute<RouteProp<RouteParams>>();
  const sendToId = useSelector((state: RootState) => isEmailVerified ? state.appFlow.phone : state.appFlow.email);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onNextClick = () => {
    dispatch(setPageProgress(3));
    navigation.navigate('GenderScreen');
  };

  const handleBackPress = () => navigation.goBack();


  const verifyCode = async (code: string) => {
    const requestParam = {
      ...(route.params.isEmail ? { email: route.params.email } : { phoneNumber: route.params.phone }),
      requestCode: code,
    };
    console.log("sayyed params:", requestParam)

    try {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        otpInputRef.current?.showInvalidCodeError(LABLE.ERROR_VERIFY_CODE);
      }, 1000)
      // const response = await verifyOTP({ code });
      // if (response) {
      //     console.log('OTP Verified Successfully:', response);
      // } else {
      //      otpInputRef.current?.showInvalidCodeError("OTP verification failed");
      //     console.error('No response received or OTP verification failed.');
      // }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      // setIsLoading(false)
    }
  };

  const resendVerificationCode = async () => {
    const requestParam = route.params.isEmail ? { email: route.params.email } : { phoneNumber: route.params.phone };
    FlashMessageComponent.show('success', 'OTP resent successfully!');

  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={isEmailVerified ? LABLE.VERIFY_PHONE : LABLE.VERIFY_EMAIL}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <View style={styles.contentContainer}>
        <Title title={LABLE.ENTER_YOUR_VERIFICATION_CODE} subTitle={`${LABLE.SEND_TO}${sendToId}`} />
        <OTPComponent
          ref={otpInputRef}
          performCodeVerification={verifyCode}
          resendVerificationCode={resendVerificationCode}
        />
        <View style={styles.spacer} />
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;

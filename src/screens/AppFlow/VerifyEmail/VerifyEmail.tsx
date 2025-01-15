import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import EmailPhoneStyles from './VerifyEmailStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import OTPComponent from '../../../component/OTPComponent/OTPComponent';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FlashMessageComponent } from '../../../component/FlashMessageComponent/FlashMessageComponent';

interface VerifyEmailScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: {
    isEmail: boolean;
    email?: string;
    phone?: string;
  };
};

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ navigation }) => {
  const styles = EmailPhoneStyles();
  const otpInputRef = useRef<{ handleNextPress: () => void, showInvalidCodeError: (message: string) => void }>(null);
  const route = useRoute<RouteProp<RouteParams>>();
  const [sendToId, setSendToId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onNextClick = () => {
    navigation.navigate('GenderScreen')
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
      <Header headerTitle={LABLE.VERIFY_EMAIL} onPress={handleBackPress} />

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

export default VerifyEmailScreen;

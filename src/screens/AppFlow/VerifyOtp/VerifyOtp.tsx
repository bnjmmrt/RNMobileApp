import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE} from '../../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import OTPComponent from '../../../component/OTPComponent/OTPComponent';
import {useRoute, RouteProp} from '@react-navigation/native';
import {FlashMessageComponent} from '../../../component/FlashMessageComponent/FlashMessageComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsEmailPhoneBothVerified,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import {RootState} from '../../../redux/slices';
import useApi from '../../../axios/useApi';
import {EndPoint} from '../../../ApiManager/config';

interface VerifyOtpScreenProps extends NativeStackScreenProps<any, any> {}

type RouteParams = {
  params: {
    isEmail: boolean;
    email?: string;
    phone?: string;
  };
};

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const styles = VerifyOtpStyles();
  const isEmailVerified = useSelector(
    (state: RootState) => state.appFlow.phone,
  );
  const otpInputRef = useRef<{
    handleNextPress: () => void;
    showInvalidCodeError: (message: string) => void;
  }>(null);
  const {apiRequest, loading, error} = useApi();

  const route = useRoute<RouteProp<RouteParams>>();
  // const { sendOtp, isMemberExist } = useSendOtp(route.params.email, route.params.phone);
  //  const { verifyOtp,isLoading } = useVerifyOtp(isMemberExist, route.params.email, route.params.phone, route.params.isEmail);
  const sendToId = useSelector((state: RootState) =>
    isEmailVerified ? state.appFlow.phone : state.appFlow.email,
  );
  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const sendOtp = async () => {
    const response = await apiRequest('post', EndPoint.check_member_logiin, {
      email: route.params.email,
      phoneNumber: route.params.phone,
    });
    if (!error) {
      FlashMessageComponent.show('success', 'OTP resent successfully!');
    } else {
      FlashMessageComponent.show(
        'error',
        'Something went wrong, please try again!',
      );
    }
  };

  useEffect(() => {
    sendOtp();
  }, [route.params]);

  const verifyCode = async () => {
    let params;

    if (route.params.isEmail) {
      params = {
        email: route.params.email,
        verificationCode: otpInputRef.current && otpInputRef.current.code,
      };
    }else{
      params = {
        phoneNumber: route.params.phone,
        verificationCode: otpInputRef.current && otpInputRef.current.code,
      };
    }
    const response:any = await apiRequest('post', EndPoint.verify_code, params);

    if (response.data.verified) {
      FlashMessageComponent.show('success', LABLE.OTP_VERIFIED_SUCCESSFULLY);
      dispatch(setPageProgress(3));
      dispatch(setIsEmailPhoneBothVerified(true));
      navigation.navigate('GenderScreen');
    } else {
      FlashMessageComponent.show(
        'error',
        LABLE.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN,
      );
    }
  };

  const onNextClick =async () => {
    otpInputRef.current && otpInputRef.current.handleNextPress();
    await verifyCode()
  };

  const handleBackPress = () => navigation.goBack();

  // const verifyCode = async (code: string) => {
  //   const requestParam = {
  //     ...(route.params.isEmail
  //       ? {email: route.params.email}
  //       : {phoneNumber: route.params.phone}),
  //     requestCode: code,
  //   };
  //   console.log('sayyed params:', requestParam);

  //   try {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       otpInputRef.current?.showInvalidCodeError(LABLE.ERROR_VERIFY_CODE);
  //     }, 1000);
  //     // const response = await verifyOTP({ code });
  //     // if (response) {
  //     //     console.log('OTP Verified Successfully:', response);
  //     // } else {
  //     //      otpInputRef.current?.showInvalidCodeError("OTP verification failed");
  //     //     console.error('No response received or OTP verification failed.');
  //     // }
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //   } finally {
  //     // setIsLoading(false)
  //   }
  // };

  const resendVerificationCode = async () => {
    sendOtp();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={isEmailVerified ? LABLE.VERIFY_PHONE : LABLE.VERIFY_EMAIL}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.ENTER_YOUR_VERIFICATION_CODE}
          subTitle={`${LABLE.SEND_TO}${sendToId}`}
        />
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

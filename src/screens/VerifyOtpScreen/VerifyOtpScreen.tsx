import {
  CommonActions,
  RouteProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeSafeAreaViewConfig,
  fetchUserProfile,
  getPriorityRole,
  loginUser,
} from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import OTPComponent from '../../component/OTPComponent/OTPComponent';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { useSendOtp } from '../../redux//hooks/useSendOtp';
import { useVerifyOtp } from '../../redux/hooks/useVerifyOtp';
import { BUTTON_LABLE, LABLE, ROLE } from '../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import {
  setEmail,
  setFirstName,
  setLastName,
  setPhone,
} from 'src/redux/slices/appFlowSlice';
import { verticalMarginScale } from 'src/utils/dimensions';

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
  const { sendOtp, isMemberExist, isGuest } = useSendOtp(
    route.params.email,
    route.params.phone,
  );
  const { verifyOtp, isLoading, error } = useVerifyOtp(
    isMemberExist,
    isGuest,
    route.params.email,
    route.params.phone,
    route.params.isEmail,
  );

  const dispatch = useDispatch();
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  console.log("fcmToken on otp screen", fcmToken)
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    otpInputRef?.current?.setApiError(error);
  }, [error]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    const sendTo = route.params.isEmail
      ? route.params.email
      : route.params.phone;
    sendTo && sendOtp(false);
  }, [route.params]);

  const onNextClick = () => otpInputRef.current?.handleNextPress();
  const handleBackPress = () => navigation.goBack();

  const redirectToHome = (data: any) => {
    console.log('dataaa', JSON.stringify(data));

    loginUser({
      id: data?.id,
      isGuest: data?.isGuest,
      roles: data?.roles,
      token: data?.token,
      varifyStatus: data?.varifyStatus,
      companyLogo: data?.user?.additionalHostInformation?.companyLogo,
      profilePicture: data?.user?.profilePicture,
    });

    dispatch(setEmail(route.params.email || ''));
    dispatch(setPhone(route.params.phone || ''));

    if (data?.token) {
      fetchUserProfile();
    }

    let role = getPriorityRole(data?.roles);
    let screenName = '';

    switch (role.roleName) {
      case ROLE.NON_MEMBER:
        screenName =
          data?.token?.length > 0 || data?.isGuest
            ? 'BottomTabBar'
            : 'BeforeAppStaticScreen';
        break;
      case ROLE.MEMBER:
        screenName = 'BottomTabBar';
        break;
      case ROLE.HOST:
        screenName = 'BottomTabBar';
        dispatch(setEmail(data?.user?.email));
        dispatch(setPhone(data?.user?.phoneNumber));
        dispatch(setFirstName(data?.user?.firstName));
        dispatch(setLastName(data?.user?.lastName));
        break;
    }

    if (screenName) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppStack', params: { screen: screenName } }],
        }),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  const callVerifyOTP = (code: string) => {
    verifyOtp(code, redirectToHome);
  };

  const clearOTPAndResend = () => {
    otpInputRef?.current?.clearOTP();
    setErrorMsg('');
    sendOtp(true);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* <FullScreenLoader loading={isLoading}> */}
      <View style={styles.container}>
        <BackButton onPress={handleBackPress} />
        <View style={styles.contentContainer}>
          <TitleSubtitle
            title={LABLE.ENTER_YOUR_VERIFICATION_CODE}
            subTitle={`${LABLE.SEND_TO}${route.params.isEmail ? route.params.email : route.params.phone
              }`}
          />
          <OTPComponent
            error={errorMsg}
            ref={otpInputRef}
            performCodeVerification={(code: string) => callVerifyOTP(code)}
            resendVerificationCode={clearOTPAndResend}
          />
          <View style={styles.spacer} />
          <Button
            disabled={false}
            style={[
              styles.btnStyle,
              {
                marginBottom: keyboardVisible ? Platform.OS === 'ios' ? verticalMarginScale(60): verticalMarginScale(10) : 0,
              },
            ]}
            title={BUTTON_LABLE.GET_STARTED}
            colorTheme="dark"
            onPress={onNextClick}
            loading={isLoading}
          />
        </View>
      </View>
      {/* </FullScreenLoader> */}
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

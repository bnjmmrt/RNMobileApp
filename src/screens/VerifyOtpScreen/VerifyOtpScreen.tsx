import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE, BUTTON_LABLE } from '../../utils/constants';
import VerifyOtpStyles from './VerifyOtpStyles';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import OTPComponent from '../../component/OTPComponent/OTPComponent';
import {
  useRoute,
  RouteProp,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import { setAuthToken, setLoginData, setRole, setUserId } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import FullScreenLoader from '../../component/FullScreenLoader';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { useSendOtp } from '../../redux//hooks/useSendOtp';
import { useVerifyOtp } from '../../redux/hooks/useVerifyOtp';
import { setEmail, setPhone } from '../../redux/slices/appFlowSlice';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
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
  const { verifyOtp, isLoading ,error} = useVerifyOtp(
    isMemberExist,
    isGuest,
    route.params.email,
    route.params.phone,
    route.params.isEmail,
  );

  const dispatch = useDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(()=>{
    otpInputRef.current.setApiError(error);
  },[error])

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
    dispatch(setLoginData(data));
    dispatch(setUserId(data?.id));
    dispatch(setRole(data?.roles[0]?.roleName));
    dispatch(setAuthToken(data?.token || ''));
    dispatch(setEmail(route.params.email || ''));
    dispatch(setPhone(route.params.phone || ''));
    const role = data.roles[0]?.roleName || 'non_member';

    if (role == 'non_member') {
      const screenName =
        data?.token?.length > 0 ? 'BottomTabBar' : 'BeforeAppStaticScreen';
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppStack', params: { screen: screenName } }],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppStack', params: { screen: 'BottomTabBar' } }],
        }),
      );
    }
  };
  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
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
            ref={otpInputRef}
            performCodeVerification={(code: string) =>
              verifyOtp(code, redirectToHome)
            }
            resendVerificationCode={() => {
              otpInputRef.current.clearOTP();
              sendOtp(true)
            }}
          />
          <View style={styles.spacer} />
          <Button
            disabled={false}
            style={styles.btnStyle}
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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import EnterEmailPhoneStyles from './EnterEmailPhoneStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEmail,
  setPageProgress,
  setPhone,
} from '../../../redux/slices/appFlowSlice';
import { RootState } from '../../../redux/slices';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { verticalMarginScale } from 'src/utils/dimensions';
import { EndPoint } from 'src/ApiManager/config';
import useApi from '../../../axios/useApi';

interface EnterEmailPhoneProps extends NativeStackScreenProps<any, any> {}

const EnterEmailPhone: React.FC<EnterEmailPhoneProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { apiRequest, loading, error } = useApi();
  // const isEmailVerified = useSelector((state: RootState) => state.appFlow.isEmailVerified);
  const varifyStatus = useSelector(
    (state: RootState) => state.auth.varifyStatus,
  );
  const isEmailVerified = varifyStatus;
  const styles = EnterEmailPhoneStyles();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const onNextClick = async () => {
    let endPoint;
    let params;
    if (varifyStatus === 1) {
      if (phoneNumberInputRef.current.validatePhoneNumber()) {
        endPoint = EndPoint.check_phone;
        params = {
          phoneNumber:
            phoneNumberInputRef.current.callingCode +
            phoneNumberInputRef.current.phoneNumber,
        };
        try {
          const response: any = await apiRequest('post', endPoint, params);
          if (response?.data.isValid) {
            dispatch(
              setPhone(
                phoneNumberInputRef.current.callingCode +
                  phoneNumberInputRef.current.phoneNumber,
              ),
            );
            navigation.navigate('VerifyEmail', {
              phone:
                phoneNumberInputRef.current.callingCode +
                phoneNumberInputRef.current.phoneNumber,
              isEmail: false,
            });
          } else {
            phoneNumberInputRef.current?.setErrorMessage(
              'Phone Number already exist.',
            );
          }
        } catch (error) {
          phoneNumberInputRef.current?.setErrorMessage(
            'Phone Number already exist.',
          );
          console.log('ererror', error);
        }
      }
    } else {
      if (emailInputRef.current.validateEmailAddress()) {
        endPoint = EndPoint.check_email;
        params = {
          email: emailInputRef.current.emailAddress,
        };
        try {
          const response: any = await apiRequest('post', endPoint, params);
          if (response?.data.isValid) {
            dispatch(setEmail(emailInputRef.current.emailAddress));
            navigation.navigate('VerifyEmail', {
              email: emailInputRef.current.emailAddress,
              isEmail: true,
            });
          } else {
            emailInputRef.current?.setErrorMessage(
              'Email address already exist.',
            );
          }
        } catch (error) {
          emailInputRef.current?.setErrorMessage(
            'Email address already exist.',
          );
          console.log('ererror', error);
        }
      }
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(1));
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header
        headerTitle={isEmailVerified === 1 ? LABLE.PHONE : LABLE.EMAIL}
        onPress={handleBackPress}
      />

      <View style={styles.contentContainer}>
        <Title
          title={
            isEmailVerified === 1
              ? LABLE.WHATS_YOUR_PHONE_NUMBER
              : LABLE.WHATS_YOUR_EMAIL_ADDRESS
          }
          subTitle={
            isEmailVerified === 1
              ? LABLE.WHATS_YOUR_PHONE_NUMBER_SUBTITLE
              : LABLE.WHATS_YOUR_EMAIL_SUBTITLE
          }
        />
        {isEmailVerified === 1 ? (
          <PhoneNumberInput ref={phoneNumberInputRef} />
        ) : (
          <EmailInput ref={emailInputRef} />
        )}
      </View>

      <Button
        disabled={false}
        style={[
          styles.btnStyle,
          {
            marginBottom: keyboardVisible ? verticalMarginScale(60) : 0,
          },
        ]}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </KeyboardAvoidingView>
  );
};

export default EnterEmailPhone;

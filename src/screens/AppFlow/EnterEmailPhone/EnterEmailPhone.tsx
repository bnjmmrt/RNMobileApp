import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import { verticalMarginScale } from 'src/utils/dimensions';
import {
  changeSafeAreaViewConfig,
  normalizeEmail,
  removeSpaceFromStr,
} from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import useApi from '../../../axios/useApi';
import Button from '../../../component/Button';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import Header from '../../../component/Header/Header';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import Title from '../../../component/Title/Title';
import { RootState } from '../../../redux/slices';
import {
  setEmail,
  setPageProgress,
  setPhone,
} from '../../../redux/slices/appFlowSlice';
import { BUTTON_LABLE, LABLE } from '../../../utils/constants';
import EnterEmailPhoneStyles from './EnterEmailPhoneStyles';

interface EnterEmailPhoneProps extends NativeStackScreenProps<any, any> {}

const EnterEmailPhone: React.FC<EnterEmailPhoneProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();

  const { apiRequest, loading, error } = useApi();
  // const isEmailVerified = useSelector((state: RootState) => state.appFlow.isEmailVerified);
  const varifyStatus = useSelector(
    (state: RootState) => state.auth.varifyStatus,
  );
  const isEmailVerified = varifyStatus;
  const styles = EnterEmailPhoneStyles();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);

  const onNextClick = async () => {
    let endPoint;
    let params;
    if (varifyStatus === 1) {
      if (phoneNumberInputRef.current.validatePhoneNumber()) {
        endPoint = EndPoint.check_phone;
        params = {
          phoneNumber: removeSpaceFromStr(
            phoneNumberInputRef.current.callingCode +
              phoneNumberInputRef.current.phoneNumber,
          ),
        };
        try {
          const response: any = await apiRequest('post', endPoint, params);
          if (response?.data.isValid) {
            dispatch(
              setPhone(
                phoneNumberInputRef.current.callingCode +
                  ' ' +
                  phoneNumberInputRef.current.phoneNumber,
              ),
            );
            navigation.navigate('VerifyEmail', {
              phone:
                phoneNumberInputRef.current.callingCode +
                ' ' +
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
          email:normalizeEmail(emailInputRef.current.emailAddress) ,
        };
        try {
          const response: any = await apiRequest('post', endPoint, params);
          if (response?.data.isValid) {
            dispatch(setEmail(normalizeEmail(emailInputRef.current.emailAddress)));
            navigation.navigate('VerifyEmail', {
              email: normalizeEmail(emailInputRef.current.emailAddress),
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
        <View style={{ height: 10 }} />
        {isEmailVerified === 1 ? (
          <PhoneNumberInput ref={phoneNumberInputRef} />
        ) : (
          <>
            <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
            <EmailInput ref={emailInputRef} />
          </>
        )}
      </View>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={[
            styles.btnStyle,
            {
              marginBottom: keyboardVisible
                ? Platform.OS === 'ios'
                  ? verticalMarginScale(60)
                  : verticalMarginScale(10)
                : 0,
            },
          ]}
          title={BUTTON_LABLE.NEXT}
          colorTheme="dark"
          onPress={onNextClick}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default EnterEmailPhone;

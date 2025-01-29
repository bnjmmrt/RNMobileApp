import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import EnterEmailPhoneStyles from './EnterEmailPhoneStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPageProgress, setPhone } from '../../../redux/slices/appFlowSlice';
import { RootState } from '../../../redux/slices';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';

interface EnterEmailPhoneProps extends NativeStackScreenProps<any, any> { }

const EnterEmailPhone: React.FC<EnterEmailPhoneProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  // const isEmailVerified = useSelector((state: RootState) => state.appFlow.isEmailVerified);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const isEmailVerified = loginData?.varifyStatus;
  const styles = EnterEmailPhoneStyles();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);


  const onNextClick = () => {
    if (loginData?.varifyStatus === 1) {
      if (phoneNumberInputRef.current.validatePhoneNumber()) {
        dispatch(setPhone(phoneNumberInputRef.current.callingCode + phoneNumberInputRef.current.phoneNumber));
        navigation.navigate('VerifyEmail', { 
          phone: phoneNumberInputRef.current.callingCode + phoneNumberInputRef.current.phoneNumber,
          isEmail: false
        });
      }
    } else {
      if (emailInputRef.current.validateEmailAddress()) {
        dispatch(setEmail(emailInputRef.current.emailAddress));
        navigation.navigate('VerifyEmail', { email: emailInputRef.current.emailAddress, isEmail: true });
      }
    }


  };

  const handleBackPress = () => {
    dispatch(setPageProgress(1));
    navigation.navigate('MyDetailsScreen');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={isEmailVerified === 1 ? LABLE.PHONE : LABLE.EMAIL}
        onPress={handleBackPress}
      />

      <View style={styles.contentContainer}>
        <Title
          title={isEmailVerified === 1 ? LABLE.WHATS_YOUR_PHONE_NUMBER : LABLE.WHATS_YOUR_EMAIL_ADDRESS}
          subTitle={isEmailVerified === 1 ? LABLE.WHATS_YOUR_PHONE_NUMBER_SUBTITLE : LABLE.WHATS_YOUR_EMAIL_SUBTITLE}
        />
        {isEmailVerified === 1 ?
          <PhoneNumberInput ref={phoneNumberInputRef} />
          :
          <EmailInput ref={emailInputRef} />}
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

export default EnterEmailPhone;

import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import EmailPhoneStyles from './EnterEmailPhoneStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPageProgress, setPhone } from '../../../redux/slices/appFlowSlice';
import { RootState } from '../../../redux/slices';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';

interface EnterEmailScreenProps extends NativeStackScreenProps<any, any> { }

const EnterEmailScreen: React.FC<EnterEmailScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const isEmailVerified = useSelector((state: RootState) => state.appFlow.isEmailVerified);
  const styles = EmailPhoneStyles();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);

  const onNextClick = () => {
    if (isEmailVerified) {
      if(phoneNumberInputRef.current.validatePhoneNumber()){
      dispatch(setPhone(phoneNumberInputRef.current.inputText));
      navigation.navigate('VerifyEmail');
      }
    } else {
      if(emailInputRef.current.validateEmailAddress()){
      dispatch(setEmail(emailInputRef.current.inputText));
      navigation.navigate('VerifyEmail');
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
        headerTitle={isEmailVerified ? LABLE.PHONE : LABLE.EMAIL}
        onPress={handleBackPress}
      />

      <View style={styles.contentContainer}>
        <Title
          title={isEmailVerified ? LABLE.ENTER_YOUR_PHONE_NUMBER : LABLE.WHATS_YOUR_EMAIL_ADDRESS}
          subTitle={isEmailVerified ? LABLE.ENTER_YOUR_PHONE_NUMBER : LABLE.WHATS_YOUR_EMAIL_SUBTITLE}
        />
        {isEmailVerified ?
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

export default EnterEmailScreen;

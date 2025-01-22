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
    const loginData = useSelector((state: RootState) => state.auth.loginData);
    console.log("sayyed logg:",loginData)

  const styles = EmailPhoneStyles();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);


  const onNextClick = () => {
    if (loginData?.varifyStatus===1) {
      if(phoneNumberInputRef.current.validatePhoneNumber()){
      dispatch(setPhone(phoneNumberInputRef.current.phoneNumber));
      navigation.navigate('VerifyEmail',{phone:phoneNumberInputRef.current.phoneNumber,isEmail:false});
      }
    } else {
      if(emailInputRef.current.validateEmailAddress()){
      dispatch(setEmail(emailInputRef.current.emailAddress));
      navigation.navigate('VerifyEmail',{email:emailInputRef.current.emailAddress,isEmail:true});
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
        {loginData?.varifyStatus===1 ?
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

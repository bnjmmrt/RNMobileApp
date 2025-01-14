import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE, ERROR_MESSAGE} from '../../../utils/constants';
import EmailPhoneStyles from './EnterEmailStyles';
import BackButton from '../../../component/BackButton/BackButton';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';

interface EnterEmailScreenProps extends NativeStackScreenProps<any, any> {}

const EnterEmailScreen: React.FC<EnterEmailScreenProps> = ({navigation}) => {
  const styles = EmailPhoneStyles();
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);

  const onNextClick = () => {
    firstNameRef.current && firstNameRef.current.handleNextPress();
    lastNameRef.current && lastNameRef.current.handleNextPress();
    navigation.navigate('VerifyEmail');
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Header title={LABLE.WHATS_YOUR_EMAIL_ADDRESS} subTitle={LABLE.WHATS_YOUR_EMAIL_SUBTITLE} />
        <Input
          ref={firstNameRef}
          label={LABLE.EMAIL_ADDRESS}
          errorMessage={ERROR_MESSAGE.FIRST_NAME}
        />
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

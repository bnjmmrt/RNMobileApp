import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE, ERROR_MESSAGE} from '../../../utils/constants';
import EmailPhoneStyles from './MyDetailsStyles';
import BackButton from '../../../component/BackButton/BackButton';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';

interface MyDetailsScreenProps extends NativeStackScreenProps<any, any> {}

const MyDetailsScreen: React.FC<MyDetailsScreenProps> = ({navigation}) => {
  const styles = EmailPhoneStyles();
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);

  const onNextClick = () => {
    firstNameRef.current && firstNameRef.current.handleNextPress();
    lastNameRef.current && lastNameRef.current.handleNextPress();
    navigation.navigate('EnterEmail');
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Header title={LABLE.ENTER_YOUR_NAME} />
        <Input
          ref={firstNameRef}
          label={LABLE.FIRST_NAME}
          errorMessage={ERROR_MESSAGE.FIRST_NAME}
        />
        <Input
          ref={lastNameRef}
          label={LABLE.LAST_NAME}
          errorMessage={ERROR_MESSAGE.LAST_NAME}
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

export default MyDetailsScreen;

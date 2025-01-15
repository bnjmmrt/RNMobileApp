import React, { useRef } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE } from '../../../utils/constants';
import EmailPhoneStyles from './EnterEmailStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';

interface EnterEmailScreenProps extends NativeStackScreenProps<any, any> { }

const EnterEmailScreen: React.FC<EnterEmailScreenProps> = ({ navigation }) => {
  const styles = EmailPhoneStyles();
  const emailRef = useRef<any>(null);

  const onNextClick = () => {
    emailRef.current && emailRef.current.handleNextPress();
    navigation.navigate('VerifyEmail');
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.EMAIL} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.WHATS_YOUR_EMAIL_ADDRESS} subTitle={LABLE.WHATS_YOUR_EMAIL_SUBTITLE} />
        <Input
          ref={emailRef}
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

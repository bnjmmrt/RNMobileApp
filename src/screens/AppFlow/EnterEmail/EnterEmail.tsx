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
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPageProgress } from '../../../redux/slices/appFlowSlice';
import { RootState } from '../../../redux/slices';

interface EnterEmailScreenProps extends NativeStackScreenProps<any, any> { }

const EnterEmailScreen: React.FC<EnterEmailScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.appFlow.email);
  const styles = EmailPhoneStyles();
  const emailRef = useRef<any>(null);

  const onNextClick = () => {
    emailRef.current && emailRef.current.handleNextPress();
    dispatch(setEmail(emailRef.current.inputText));
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
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_A_VALID_EMAIL_ADDRESS}
          defaultValue={email}
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

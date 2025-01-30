import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE, ERROR_MESSAGE} from '../../../utils/constants';
import EmailPhoneStyles from './MyDetailsStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {
  setFirstName,
  setIsEmailVerified,
  setLastName,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';

interface MyDetailsScreenProps extends NativeStackScreenProps<any, any> {}

const MyDetailsScreen: React.FC<MyDetailsScreenProps> = ({navigation}) => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.appFlow);
  const isEmailPhoneBothVerified = useSelector(
    (state: RootState) => state.appFlow.isEmailPhoneBothVerified,
  );

  const styles = EmailPhoneStyles();
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);

  const onNextClick = () => {
    if (
      firstNameRef.current.validateInputs() &&
      // firstNameRef.current.inputText.length > 2 &&
      lastNameRef.current.validateInputs()
      //  && lastNameRef.current.inputText.length > 2
    ) {
      dispatch(setFirstName(firstNameRef.current.inputText));
      dispatch(setLastName(lastNameRef.current.inputText));
      dispatch(setIsEmailVerified(false));
      if (isEmailPhoneBothVerified) {
        dispatch(setPageProgress(3));
        navigation.navigate('GenderScreen');
      } else {
        dispatch(setPageProgress(2));
        navigation.navigate('EnterEmailPhone');
      }
    }
  };

  const handleBackPress = () => {
    if(loginData?.isInvited || loginData.token.length > 0){
      navigation.navigate('BottomTabBar');
    } else {
      navigation.navigate('BeforeAppStaticScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.MY_DETAILS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.ENTER_YOUR_NAME} />
        <Input
          ref={firstNameRef}
          label={LABLE.FIRST_NAME}
          errorMessage={ERROR_MESSAGE.FIRST_NAME}
          defaultValue={userDetails.firstName}
        />
        <Input
          ref={lastNameRef}
          label={LABLE.LAST_NAME}
          errorMessage={ERROR_MESSAGE.LAST_NAME}
          defaultValue={userDetails.lastName}
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

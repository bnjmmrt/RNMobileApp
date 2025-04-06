import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';
import Title from '../../../component/Title/Title';
import {
  BUTTON_LABLE,
  ERROR_MESSAGE,
  LABLE,
  ROLE,
} from '../../../utils/constants';
import EmailPhoneStyles from './MyDetailsStyles';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { RootState } from '../../../redux/slices';
import {
  setFirstName,
  setIsEmailVerified,
  setLastName,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';

interface MyDetailsScreenProps extends NativeStackScreenProps<any, any> {}

const MyDetailsScreen: React.FC<MyDetailsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();

  const userDetails = useSelector((state: RootState) => state.appFlow);
  const role = useSelector((state: RootState) => state.auth.role);

  const styles = EmailPhoneStyles();
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);

  const onNextClick = () => {
    firstNameRef.current.validateInputs();
    lastNameRef.current.validateInputs();
    // validateFirstName('FirstName')
    // validateLastName('LastName')
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs()
    ) {
      dispatch(setFirstName(firstNameRef.current.inputText));
      dispatch(setLastName(lastNameRef.current.inputText));
      dispatch(setIsEmailVerified(false));
      if (role === ROLE.HOST) {
        dispatch(setPageProgress(3));
        navigation.navigate('GenderScreen');
      } else {
        if (userDetails?.isEmailPhoneBothVerified) {
          dispatch(setPageProgress(3));
          navigation.navigate('GenderScreen');
        } else {
          dispatch(setPageProgress(2));
          navigation.navigate('EnterEmailPhone');
        }
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
    // if (loginData?.isInvited || loginData.token.length > 0) {
    //   navigation.navigate('BottomTabBar');
    // } else {
    //   navigation.navigate('BeforeAppStaticScreen');
    // }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.MY_DETAILS} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.ENTER_YOUR_NAME} />
        <Input
          ref={firstNameRef}
          label={LABLE.FIRST_NAME}
          errorMessage={ERROR_MESSAGE.FIRST_NAME}
          defaultValue={userDetails.firstName}
          maxLength={30}
          isName={true}
        />
        <Input
          ref={lastNameRef}
          label={LABLE.LAST_NAME}
          errorMessage={ERROR_MESSAGE.LAST_NAME}
          defaultValue={userDetails.lastName}
          maxLength={30}
          isName={true}
        />
      </View>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.NEXT}
          colorTheme="dark"
          onPress={onNextClick}
        />
      ) : null}
    </View>
  );
};

export default MyDetailsScreen;

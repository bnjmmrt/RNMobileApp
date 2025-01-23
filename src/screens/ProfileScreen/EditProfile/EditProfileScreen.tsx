import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
} from '../../../utils/constants';
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

import useApi from '../../../axios/useApi';
import {EndPoint} from '../../../ApiManager/config';
import {Wp} from '../../../utils/dimensions';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({navigation}) => {
  const {apiRequest, loading, error} = useApi();

  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.appFlow);
  const isEmailPhoneBothVerified = useSelector(
    (state: RootState) => state.appFlow.isEmailPhoneBothVerified,
  );

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>();

  const fetch = async () => {
    // const focusResponse = await apiRequest('get', EndPoint.get_focuses);
    // dispatch(setCreativeFocus(focusResponse.data));
    // const interestResponse = await apiRequest('get', EndPoint.interests);
    // dispatch(setInterests(interestResponse.data));
  };

  useEffect(() => {
    fetch();
  }, []);

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
        navigation.navigate('EnterEmail');
      }
    }
  };

  const handleBackPress = () => {
    navigation.navigate('AppStack');
  };

  const openDatePicker = () => {
    bottomSheetRef.current?.open(); // Open the date picker
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.EDIT_PROFILE}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <View style={styles.contentContainer}>
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
        <Text style={[styles.label]}>Email Address</Text>
        <PhoneNumberInput ref={phoneNumberInputRef}  />

        <Text style={[styles.label]}>Phone Number</Text>
        <EmailInput ref={emailInputRef} />


        <CustomSelectableText
          placeholder={LABLE.DATE_PLACEHOLDER}
          leftImage={IMAGES.calender}
          rightImage={IMAGES.downArrow}
          errorMessage={errorMessage}
          defaultValue={selectedDate} // Display the selected date
          onPress={openDatePicker} // Open the date picker when pressed
        />
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
       {/* <DatepickerBottomSheet ref={bottomSheetRef} setSelectedDate={handleDateChange} date={date} setDate={setDate} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    paddingVertical: 2,
    fontSize: 14,
    paddingTop: 20,
  },
});

export default EditProfileScreen;

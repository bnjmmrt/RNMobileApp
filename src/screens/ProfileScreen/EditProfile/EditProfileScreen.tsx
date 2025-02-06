import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
  PROFILE,
} from '../../../utils/constants';
import Button from '../../../component/Button';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import useApi from '../../../axios/useApi';
import { EndPoint } from '../../../ApiManager/config';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, Wp } from '../../../utils/dimensions';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import DatePickerComponent from './DatePickerComponent';
import BaseCityComponent from './BaseCityComponent';
import CreativeFocusComponent from './CreativeFocusComponent';
import GenderComponent from './GenderComponent';
import Toast from 'src/component/Toast/Toast';
import { setNotificationSettings } from '../../../redux/slices/appSettingsSlice';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> { }

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.appFlow);
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const [userDetails, setUserDetails] = useState(data);

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);
  const [gender, selectedGender] = useState(userDetails.gender);
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(birthday);
  const [isToastShown, setIsToastShown] = useState(false);
  const [selectedCreativeFocus, getSelectedCreativeFocus] = useState<any[]>();

  const getUserSettingAndDetails = async () => {
    const response:any =await apiRequest(
      'get',
      EndPoint.user_settings + loginData?.userId,
    );
    console.log("getUserSettingAndDetails",response)
    if (response.status===200) {
      //dependiing on API response parse data and set
      // setUserDetails(response.data.userData);
      dispatch(setNotificationSettings(response.data.notificationsSettings))
    }
  };
  useEffect(() => {
    if (loginData?.isSignUpCompleted) {
      phoneNumberInputRef?.current.setDisabled(true);
      phoneNumberInputRef?.current.setPhoneNumber(userDetails.phone);
      phoneNumberInputRef?.current.setCallingCode(
        userDetails.countryCallingCode,
      );
      // phoneNumberInputRef?.current.setCode(userDetails.countryCodeFlag);
      phoneNumberInputRef?.current.setFlag(userDetails.countryCodeFlag || '🇺🇸');
      emailInputRef?.current.setDisabled(true);
      emailInputRef?.current.setEmailAddress(userDetails.email);
    }

    if (loginData?.varifyStatus === 2) {
      phoneNumberInputRef?.current.setDisabled(true);
      phoneNumberInputRef?.current.setPhoneNumber(userDetails.phone);
      phoneNumberInputRef?.current.setCallingCode(
        userDetails.countryCallingCode,
      );
      // phoneNumberInputRef?.current.setCode(userDetails.countryCodeFlag);
      phoneNumberInputRef?.current.setFlag(userDetails.countryCodeFlag || '🇺🇸');
    }

    if (loginData?.varifyStatus === 1) {
      emailInputRef?.current.setDisabled(true);
      emailInputRef?.current.setEmailAddress(userDetails.email);
    }

    getUserSettingAndDetails();
  }, []);

  const onConfirmClick = async () => {
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs() &&
      birthDayRef.current.validateBirthDate() &&
      baseCityRef.current.validateBaseCity() &&
      !isToastShown
    ) {
      const fileUploadResponse: any = await apiRequest(
        'put',
        EndPoint.user_profile_picture + loginData?.userId,
        { profilePicture: userDetails.profilePic },
      );
      console.log('fileUploadResponse,fileUploadResponse');
      if (fileUploadResponse.data) {
        const requestObject: any = {
          address: {
            address: baseCityRef.current.selectedCity.address,
            city: '',
            latitude: '',
            longitude: '',
            placeId: baseCityRef.current.selectedCity.placeId,
            regionCode: '',
          },
          birthDate: userDetails.birthday,
          email: userDetails.email,
          firstName: firstNameRef.current.inputText,
          gender: gender,
          lastName: lastNameRef.current.inputText,
          mobilePhone: userDetails.phone,
          creativeFocus: selectedCreativeFocus
            ? selectedCreativeFocus.map((item: any) => item.id)
            : userDetails.creativeFocus.map((item: any) => item.id),
        };
        console.log('requestObject', requestObject);

        const response: any = await apiRequest(
          'put',
          EndPoint.user_profile + loginData?.userId,
          requestObject,
        );
        console.log('response,response');
        if (response.data) {
          //display success
        }
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle={PROFILE.EDIT_PROFILE}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          {loginData?.isSignUpCompleted ? (
            <>
              <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
              <EmailInput ref={emailInputRef} />
              <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
              <PhoneNumberInput ref={phoneNumberInputRef} />
            </>
          ) : (
            <>
              {loginData?.varifyStatus === 2 ? (
                <>
                  <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
                  <PhoneNumberInput ref={phoneNumberInputRef} />
                </>
              ) : (
                <>
                  <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
                  <EmailInput ref={emailInputRef} />
                </>
              )}
            </>
          )}

          {!loginData?.isSignUpCompleted && (
            <View>
              <Text style={[styles.label]}>{LABLE.GENDER}</Text>
              <GenderComponent selectedGender={selectedGender} />

              <Text style={[styles.label]}>{LABLE.BIRTHDAY}</Text>
              <DatePickerComponent ref={birthDayRef} birthDate={selectedDate} />

              <Text style={[styles.label]}>{LABLE.BASE_CITY}</Text>
              <BaseCityComponent ref={baseCityRef} />

              <Text style={[styles.label]}>{LABLE.CREATIVE_FOCUS}</Text>
              <CreativeFocusComponent
                setIsToastShown={setIsToastShown}
                getSelectedData={getSelectedCreativeFocus}
              />
            </View>
          )}
        </View>
        {isToastShown && (
          <Toast
            message={'Please select at least one'}
            onClose={() => setIsToastShown(false)}
          />
        )}

      </ScrollView>
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onConfirmClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20
  },
  btnStyle: {
    // width: Wp(85),
    // height: 50,
    borderRadius: radiusScale(100),
    bottom:Platform.OS==='android' ? verticalMarginScale(20) :0
  },
  contentContainer: {
    flex: 1,
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: { paddingBottom: verticalMarginScale(200) },
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
  },
});

export default EditProfileScreen;

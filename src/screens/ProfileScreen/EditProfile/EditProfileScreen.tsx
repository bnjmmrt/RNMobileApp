import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import useApi from '../../../axios/useApi';
import {EndPoint} from '../../../ApiManager/config';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  Wp,
} from '../../../utils/dimensions';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import DatePickerComponent from './DatePickerComponent';
import BaseCityComponent from './BaseCityComponent';
import CreativeFocusComponent from './CreativeFocusComponent';
import GenderComponent from './GenderComponent';
import Toast from 'src/component/Toast/Toast';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {extractCountryCode} from 'src/utils/functions';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const genderList = [
  {id: 0, gender: 'Male'},
  {id: 1, gender: 'Female'},
  {id: 2, gender: 'Non-binary'},
  {id: 3, gender: 'Prefer not to say'},
];
const EditProfileScreen: React.FC<EditProfileScreenProps> = ({navigation}) => {
  const {apiRequest, loading, error} = useApi();
  const dispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);

  const getGenderId = (item: any) => {
    switch (item) {
      case 'MALE':
        return 0;
      case 'FEMALE':
        return 1;
      case 'NON-BINARY':
        return 2;
      default:
        return 3;
    }
  };
  const [genderId, setGender] = useState(getGenderId(profileData?.gender));

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    profileData?.dateOfBirth,
  );
  const [isToastShown, setIsToastShown] = useState(false);
  const [selectedCreativeFocus, getSelectedCreativeFocus] = useState<any[]>();

  useEffect(() => {
    const phoneNumberDetails = extractCountryCode(profileData?.phoneNumber);
    if (loginData?.isSignUpCompleted) {
      phoneNumberInputRef?.current.setDisabled(true);
      phoneNumberInputRef?.current.setPhoneNumber(profileData?.phoneNumber);
      // phoneNumberInputRef?.current.setCallingCode(
      //   phoneNumberDetails?.countryCallingCode,
      // );
      phoneNumberInputRef?.current.setCallingCode(null);
      phoneNumberInputRef?.current.setFlag(phoneNumberDetails?.flag);
      emailInputRef?.current.setDisabled(true);
      emailInputRef?.current.setEmailAddress(profileData?.email);
    }

    if (loginData?.varifyStatus === 2) {
      phoneNumberInputRef?.current.setDisabled(true);
      phoneNumberInputRef?.current.setPhoneNumber(profileData?.phoneNumber);
      phoneNumberInputRef?.current.setFlag(phoneNumberDetails?.flag);
      phoneNumberInputRef?.current.setCallingCode(null);
    }

    if (loginData?.varifyStatus === 1) {
      emailInputRef?.current.setDisabled(true);
      emailInputRef?.current.setEmailAddress(profileData?.email);
    }

    // getUserSettingAndDetails();
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
        EndPoint.user_profile_picture + loginData?.id,
        {profilePicture: profileData?.imageUrl},
      );
      console.log('fileUploadResponse,fileUploadResponse', fileUploadResponse);
      if (fileUploadResponse.status === 200) {
        const requestObject: any = {
          address: {
            address: baseCityRef.current.selectedCity.address,
            city: '',
            latitude: '',
            longitude: '',
            placeId: baseCityRef.current.selectedCity.placeId,
            regionCode: '',
          },
          birthDate: birthDayRef.current.selectedDate,
          email: profileData?.email,
          firstName: firstNameRef.current.inputText,
          gender: genderId,
          lastName: lastNameRef.current.inputText,
          mobilePhone: profileData?.phoneNumber,
          // creativeFocus: selectedCreativeFocus
          //   ? selectedCreativeFocus.map((item: any) => item.id)
          //   : profileData?.creativeFocus.map((item: any) => item.id),
        };
        console.log('requestObject', requestObject);

        const response: any = await apiRequest(
          'put',
          EndPoint.user_profile + loginData?.id,
          requestObject,
        );
        console.log('response,response');
        if (response.status === 200) {
          //display success
          FlashMessageComponent.show('success', 'Profile Updated Successfully');
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
            defaultValue={profileData?.firstName}
          />
          <Input
            ref={lastNameRef}
            label={LABLE.LAST_NAME}
            errorMessage={ERROR_MESSAGE.LAST_NAME}
            defaultValue={profileData?.lastName}
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
              <GenderComponent
                setGender={setGender}
                selectedGender={genderId}
                list={genderList}
              />

              <Text style={[styles.label]}>{LABLE.BIRTHDAY}</Text>
              <DatePickerComponent ref={birthDayRef} birthDate={selectedDate} />

              <Text style={[styles.label]}>{LABLE.BASE_CITY}</Text>
              <BaseCityComponent ref={baseCityRef} />

              <Text
                style={[
                  styles.label,
                  {
                    marginTop: !baseCityRef.current?.validateBaseCity()
                      ? verticalMarginScale(24)
                      : 0,
                  },
                ]}>
                {LABLE.CREATIVE_FOCUS}
              </Text>
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
        loading={loading}
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
    borderRadius: radiusScale(100),
    bottom: verticalMarginScale(20),
  },
  contentContainer: {
    flex: 1,
    // paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: {paddingBottom: verticalMarginScale(200)},
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default EditProfileScreen;

import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
  PROFILE,
  genderList,
  ROLE,
} from '../../../utils/constants';
import Button from '../../../component/Button';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import useApi from '../../../axios/useApi';
import { EndPoint } from '../../../ApiManager/config';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from '../../../utils/dimensions';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import DatePickerComponent from './DatePickerComponent';
import BaseCityComponent from './BaseCityComponent';
import CreativeFocusComponent from './CreativeFocusComponent';
import GenderComponent from './GenderComponent';
import Toast from 'src/component/Toast/Toast';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { extractCountryCode } from 'src/utils/functions';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> { }

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);

  const getGender = (gender: string) => {
    return genderList.find(item => item.value === gender);
  };

  const [gender, setGender] = useState<any>(!loginData?.isInvited && getGender(profileData.gender));
  const [isToastShown, setIsToastShown] = useState(false);
  const [selectedCreativeFocus, getSelectedCreativeFocus] = useState<any[]>(!loginData?.isInvited && profileData?.focuses);

  useEffect(() => {
    if (profileData?.email && profileData?.email !== '') {
      emailInputRef?.current.setDisabled(true);
      emailInputRef?.current.setEmailAddress(profileData?.email);
    }
    if (profileData?.phoneNumber && profileData?.phoneNumber !== '') {
      const phoneNumberDetails = extractCountryCode(profileData?.phoneNumber);
      phoneNumberInputRef?.current.setDisabled(true);
      phoneNumberInputRef?.current.setPhoneNumber(profileData?.phoneNumber);
      phoneNumberInputRef?.current.setFlag(phoneNumberDetails?.flag);
      phoneNumberInputRef?.current.setCallingCode(null);
    }
  }, []);

  const fetchUserById = async () => {
    try {
      const response: any = await apiRequest('post',
        EndPoint.get_user_with_role_by_id,
        { id: userId },
      );
      if (response.status === 200) {
        dispatch(setProfileData(response?.data));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const onConfirmClick = async () => {
    if (isGuest && loginData.roles[0]?.roleName === ROLE.NON_MEMBER) {
      if (
        firstNameRef.current.validateInputs() &&
        lastNameRef.current.validateInputs()) {
        const requestObject: any = {
          // email: profileData?.email,
          firstName: firstNameRef.current.inputText,
          lastName: lastNameRef.current.inputText,
        };

        const response: any = await apiRequest(
          'put',
          EndPoint.user_profile + userId,
          requestObject,
        );
        if (response.status === 200) {
          fetchUserById()
          FlashMessageComponent.show('success', LABLE.PROFILE_UPDATED_SUCCESSFULLY);
          handleBackPress();
        }
      }
    }
    if (
      firstNameRef.current.validateInputs() &&
      lastNameRef.current.validateInputs() &&
      birthDayRef.current.validateBirthDate() &&
      baseCityRef.current.validateBaseCity() &&
      selectedCreativeFocus && selectedCreativeFocus.length > 0 &&
      !isToastShown
    ) {
      const requestObject: any = {
        address: {
          address: baseCityRef.current.selectedCity.address,
          city: '',
          latitude: '',
          longitude: '',
          placeId: baseCityRef.current.selectedCity.placeId,
          regionCode: '',
        },
        birthDate: birthDayRef.current.selectedDate,//convertDateFormat(birthDayRef.current.selectedDate),
        // email: profileData?.email,
        firstName: firstNameRef.current.inputText,
        gender: gender?.value,
        lastName: lastNameRef.current.inputText,
        // mobilePhone: profileData?.phoneNumber,
        focusIds: selectedCreativeFocus.length
          ? selectedCreativeFocus.map((item: any) => item.id)
          : profileData?.creativeFocus.map((item: any) => item.id),
      };

      const response: any = await apiRequest(
        'put',
        EndPoint.user_profile + userId,
        requestObject,
      );
      if (response.status === 200) {
        const responseUser: any = await apiRequest(
          'get',
          EndPoint.user + userId,
        );
        if (responseUser.status === 200) {
          dispatch(setProfileData({...responseUser?.data, profilePicture: responseUser?.data?.imageUrl}));
        }
        FlashMessageComponent.show('success', LABLE.PROFILE_UPDATED_SUCCESSFULLY);
        handleBackPress();
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack()
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
          {profileData?.email && profileData?.email !== '' && (
            <>
              <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
              <EmailInput ref={emailInputRef} />
            </>
          )}
          {profileData?.phoneNumber && profileData?.phoneNumber !== '' && (
            <>
              <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
              <PhoneNumberInput ref={phoneNumberInputRef} />
            </>
          )}
          {/* {loginData?.isSignUpCompleted ? (
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
          )} */}

          {!isGuest && (
            <View>
              <Text style={[styles.label]}>{LABLE.GENDER}</Text>
              <GenderComponent
                setGender={setGender}
                selectedGender={gender?.id}
                list={genderList}
              />

              <Text style={[styles.label]}>{LABLE.BIRTHDAY}</Text>
              <DatePickerComponent ref={birthDayRef} birthDate={profileData.dateOfBirth} />

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
          <View style={{ marginTop: 100 }}>

            <Toast
              message={'Please select at least one'}
              onClose={() => setIsToastShown(false)}
            />
          </View>
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
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  label: {
    // paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default EditProfileScreen;
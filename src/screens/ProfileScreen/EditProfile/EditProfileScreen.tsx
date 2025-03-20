import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';
import {
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  genderList,
  LABLE,
  PROFILE,
  ROLE,
} from '../../../utils/constants';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Toast from 'src/component/Toast/Toast';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { extractCountryCode, fontFamily } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { EndPoint } from '../../../ApiManager/config';
import useApi from '../../../axios/useApi';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import { RootState } from '../../../redux/slices';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from '../../../utils/dimensions';
import BaseCityComponent from './BaseCityComponent';
import CreativeFocusComponent from './CreativeFocusComponent';
import DatePickerComponent from './DatePickerComponent';
import GenderComponent from './GenderComponent';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();

  const { userId, isGuest, profileData, role } = useSelector(
    (state: RootState) => ({
      isGuest: state.auth.isGuest,
      role: state.auth.role,
      userId: state.auth.userId,
      profileData: state.appFlowApiData.profileData,
    }),
    shallowEqual,
  );

  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const getGender = (gender: string) => {
    return genderList.find(item => item.value === gender);
  };

  const [gender, setGender] = useState<any>(
    !isGuest && getGender(profileData.gender),
  );
  const [isToastShown, setIsToastShown] = useState(false);
  const [selectedCreativeFocus, getSelectedCreativeFocus] = useState<any[]>(
    !isGuest && profileData?.focuses,
  );
  const [selectedCity, setSelectedCity] = useState({
    address: profileData?.city,
    placeId: profileData?.placeId,
  });

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
      const response: any = await apiRequest(
        'post',
        EndPoint.get_user_with_role_by_id,
        { id: userId },
      );
      if (response.success) {
        dispatch(setProfileData(response?.data));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const validateName = (name: string) => {
    const regex = /^[A-Za-z]+$/;
    let isFirstNameValid = false;
    let isLastNameValid = false;
    if (
      name === 'FirstName' &&
      firstNameRef?.current?.inputText.trim().length > 30
    ) {
      firstNameRef?.current?.setErrorMessage(
        ERROR_MESSAGE.FIRST_NAME_SIZE_EXCEED,
      );
      isFirstNameValid = false;
    } else {
      if (
        firstNameRef?.current?.inputText.trim() !== '' &&
        !regex.test(firstNameRef?.current?.inputText)
      ) {
        firstNameRef?.current?.setErrorMessage(
          ERROR_MESSAGE.FIRST_NAME_INVALID_CHARACTERS,
        );
        isFirstNameValid = false;
      } else {
        isFirstNameValid = true;
      }
    }

    if (
      name === 'LastName' &&
      lastNameRef?.current?.inputText.trim().length > 30
    ) {
      lastNameRef?.current?.setErrorMessage(
        ERROR_MESSAGE.LAST_NAME_SIZE_EXCEED,
      );
      isLastNameValid = false;
    } else {
      if (
        lastNameRef?.current?.inputText.trim() !== '' &&
        !regex.test(lastNameRef?.current?.inputText)
      ) {
        lastNameRef?.current?.setErrorMessage(
          ERROR_MESSAGE.LAST_NAME_INVALID_CHARACTERS,
        );
        isLastNameValid = false;
      } else {
        isLastNameValid = true;
      }
    }

    return isFirstNameValid && isLastNameValid;
  };

  const onConfirmClick = async () => {
    if (isGuest && role === ROLE.NON_MEMBER) {
      if (
        firstNameRef.current.validateInputs() &&
        validateName('FirstName') &&
        lastNameRef.current.validateInputs() &&
        validateName('LastName')
      ) {
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
        if (response.success) {
          await fetchUserById();
          FlashMessageComponent.show(
            'success',
            LABLE.PROFILE_UPDATED_SUCCESSFULLY,
          );
          handleBackPress();
        }
      }
    } else {
      firstNameRef.current.validateInputs();
      validateName('FirstName');
      lastNameRef.current.validateInputs();
      validateName('LastName');
      baseCityRef.current.validateBaseCity();
      if (selectedCreativeFocus?.length === 0) {
        setIsToastShown(true);
      }
      if (
        firstNameRef.current.validateInputs() &&
        validateName('FirstName') &&
        lastNameRef.current.validateInputs() &&
        validateName('LastName') &&
        birthDayRef.current.validateBirthDate() &&
        baseCityRef.current.validateBaseCity()
      ) {
        if (selectedCreativeFocus && selectedCreativeFocus.length) {
          setIsToastShown(false);
          const requestObject: any = {
            address: {
              address: baseCityRef.current.selectedCity.address,
              city: '',
              latitude: '',
              longitude: '',
              placeId: baseCityRef.current.selectedCity.placeId,
              regionCode: '',
            },
            birthDate: birthDayRef.current.selectedDate, //convertDateFormat(birthDayRef.current.selectedDate),
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
          if (response.success) {
            const responseUser: any = await apiRequest(
              'get',
              `${EndPoint.user}/${userId}`,
            );
            if (responseUser.success) {
              dispatch(
                setProfileData({
                  ...responseUser?.data,
                  profilePicture: responseUser?.data?.imageUrl,
                }),
              );
            }
            FlashMessageComponent.show(
              'success',
              LABLE.PROFILE_UPDATED_SUCCESSFULLY,
            );
            handleBackPress();
          }
        } else {
          setIsToastShown(true);
        }
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View
        style={[
          styles.container,
          {
            paddingBottom: keyboardVisible
              ? Platform.OS === 'ios'
                ? verticalMarginScale(50)
                : verticalMarginScale(10)
              : 0,
          },
        ]}>
        <Header
          headerTitle={PROFILE.EDIT_PROFILE}
          onPress={handleBackPress}
          showProgressBar={false}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}>
          {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}> */}
          <View style={styles.contentContainer}>
            <Input
              ref={firstNameRef}
              label={LABLE.FIRST_NAME}
              errorMessage={ERROR_MESSAGE.FIRST_NAME}
              defaultValue={profileData?.firstName}
              maxLength={30}
            />
            <Input
              ref={lastNameRef}
              label={LABLE.LAST_NAME}
              errorMessage={ERROR_MESSAGE.LAST_NAME}
              defaultValue={profileData?.lastName}
              maxLength={30}
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
                <DatePickerComponent
                  ref={birthDayRef}
                  birthDate={profileData.dateOfBirth}
                />

                <Text style={[styles.label]}>{LABLE.BASE_CITY}</Text>
                <BaseCityComponent
                  location={{
                    address: selectedCity?.address,
                    placeId: selectedCity?.placeId,
                  }}
                  ref={baseCityRef}
                  onLocationSelect={city => {
                    console.log('selected city', city);
                    if (city.address !== selectedCity.address) {
                      setSelectedCity(city);
                    }
                  }}
                />

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
                <Text style={styles.subTitle}>{LABLE.SELECT_UPTO_3}</Text>
                <CreativeFocusComponent
                  setIsToastShown={setIsToastShown}
                  getSelectedData={getSelectedCreativeFocus}
                />
              </View>
            )}
          </View>
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
        {isToastShown && (
          <View
            style={{
              bottom: Platform.OS === 'ios' ? 20 : 0,
              position: 'relative',
            }}>
            <Toast
              toastStyle={{ position: 'relative', width: '90%' }}
              message={LABLE.PLEASE_SELECT_AT_LEAST_ONE}
              onClose={() => setIsToastShown(false)}
            />
          </View>
        )}
        {!keyboardVisible ? (
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.CONFIRM}
            colorTheme="dark"
            onPress={onConfirmClick}
            loading={loading}
          />
        ) : null}
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: verticalMarginScale(40),
  },
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  label: {
    // paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 5,
  },
  subTitle: {
    color: COLORS.light_text,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default EditProfileScreen;

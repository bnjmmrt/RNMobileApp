import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import Input, { InputRefMethods } from '../../../component/Input/Input';
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
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

interface EditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();

  const { userId, isGuest, profileData, role, token } = useSelector(
    (state: RootState) => ({
      isGuest: state.auth.isGuest,
      role: state.auth.role,
      token: state.auth.token,
      userId: state.auth.userId,
      profileData: state.appFlowApiData.profileData,
    }),
    shallowEqual,
  );

  const firstNameRef = useRef<InputRefMethods>(null);
  const lastNameRef = useRef<InputRefMethods>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const birthDayRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const getGender = (gender: string) => {
    return genderList.find(item => item.id === gender);
  };

  const [gender, setGender] = useState<any>(
    token && getGender(profileData.gender),
  );
  const [isToastShown, setIsToastShown] = useState(false);
  const [selectedCreativeFocus, getSelectedCreativeFocus] = useState<any[]>(
    token && profileData?.focuses,
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

  const scrollToInputRef = (ref?: React.RefObject<TextInput>) => {
    if (ref?.current) {
      ref?.current?.measureLayout(
        scrollViewRef?.current,
        (x: number, y: number) => {
          console.log(y, x);

          scrollViewRef.current?.scrollTo({
            y: y, // Add some padding above
            animated: true,
          });
        },
      );
    }
  };

  const validateName = (name: string) => {
    const regex = /^[A-Za-z]+$/;
    let isFirstNameValid = false;
    let isLastNameValid = false;
    if (firstNameRef?.current?.validateInputs()) {
      if (
        name === 'FirstName' &&
        firstNameRef?.current?.inputText &&
        firstNameRef?.current?.inputText.trim().length > 30
      ) {
        firstNameRef?.current?.setErrorMessage(
          ERROR_MESSAGE.FIRST_NAME_SIZE_EXCEED,
        );
        isFirstNameValid = false;
      } else {
        if (
          firstNameRef?.current?.inputText.trim() !== '' &&
          !regex.test(firstNameRef?.current?.inputText || '')
        ) {
          firstNameRef?.current?.setErrorMessage(
            ERROR_MESSAGE.FIRST_NAME_INVALID_CHARACTERS,
          );
          isFirstNameValid = false;
        } else {
          isFirstNameValid = true;
        }
      }
    } else {
      isFirstNameValid = false;
    }

    if (lastNameRef?.current?.validateInputs()) {
      if (
        name === 'LastName' &&
        lastNameRef?.current?.inputText &&
        lastNameRef?.current?.inputText.trim().length > 30
      ) {
        lastNameRef?.current?.setErrorMessage(
          ERROR_MESSAGE.LAST_NAME_SIZE_EXCEED,
        );
        isLastNameValid = false;
      } else {
        if (
          lastNameRef?.current?.inputText.trim() !== '' &&
          !regex.test(lastNameRef?.current?.inputText || '')
        ) {
          lastNameRef?.current?.setErrorMessage(
            ERROR_MESSAGE.LAST_NAME_INVALID_CHARACTERS,
          );
          isLastNameValid = false;
        } else {
          isLastNameValid = true;
        }
      }
    } else {
      isLastNameValid = false;
    }

    if (!isFirstNameValid || !isLastNameValid)
      scrollToInputRef(firstNameRef?.current?.inputRef);

    return isFirstNameValid && isLastNameValid;
  };

  const onConfirmClick = async () => {
    if (isGuest && role === ROLE.NON_MEMBER) {
      if (validateName('FirstName') && validateName('LastName')) {
        const requestObject: any = {
          // email: profileData?.email,
          firstName: firstNameRef?.current?.inputText,
          lastName: lastNameRef?.current?.inputText,
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
      validateName('FirstName');
      validateName('LastName');
      baseCityRef.current.validateBaseCity();
      if (!baseCityRef.current.validateBaseCity()) {
        scrollViewRef?.current?.scrollToEnd({ animated: true });
      }
      // if (!birthDayRef.current.validateBirthDate()) {
      //   scrollViewRef?.current?.scrollToEnd({ animated: true });
      // }
      if (selectedCreativeFocus?.length === 0) {
        setIsToastShown(true);
        scrollViewRef?.current?.scrollToEnd({ animated: true });
      }
      if (
        validateName('FirstName') &&
        validateName('LastName') &&
        // birthDayRef.current.validateBirthDate() &&
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
            firstName: firstNameRef?.current?.inputText,
            gender: gender?.id,
            lastName: lastNameRef?.current?.inputText,
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
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
              isName={true}
            />
            <Input
              ref={lastNameRef}
              label={LABLE.LAST_NAME}
              errorMessage={ERROR_MESSAGE.LAST_NAME}
              defaultValue={profileData?.lastName}
              maxLength={30}
              isName={true}
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

            {token && (
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
                  timeZone={profileData?.timeZone}
                  dateFormat="MM/DD/YYYY"
                  isDOB={true}
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
      </KeyboardAvoidingView>
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
      <Button
        disabled={false}
        style={[
          styles.btnStyle,
          { display: keyboardVisible ? 'none' : 'flex' },
        ]}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onConfirmClick}
        loading={loading}
      />
      {/* {!keyboardVisible ? (
        ) : null} */}
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
    bottom: BOTTOM_SAFEAREA_SPACING,
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

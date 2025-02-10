import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
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
  verticalScale,
  Wp,
} from '../../../utils/dimensions';
import PhoneNumberInput from '../../../component/PhonNumberComponent/PhoneNumberInput';
import EmailInput from '../../../component/EmailComponent/EmailInput';
import DatePickerComponent from './DatePickerComponent';
import BaseCityComponent from './BaseCityComponent';
import CreativeFocusComponent from './CreativeFocusComponent';
import GenderComponent from './GenderComponent';
import Toast from 'src/component/Toast/Toast';
import {setNotificationSettings} from '../../../redux/slices/appSettingsSlice';

interface HostEditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const HostEditProfileScreen: React.FC<HostEditProfileScreenProps> = ({
  navigation,
}) => {
  const {apiRequest, loading, error} = useApi();
  const dispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const memberProfileData = useSelector(
    (state: RootState) => state.appFlowApiData.memberProfileData,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [bio, setBio] = useState('');

  const companyNameRef = useRef<any>(null);
  const bioRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const websiteRef = useRef<any>(null);

  const [isToastShown, setIsToastShown] = useState(false);

  const getHostDetails = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.host_profile + loginData?.id,
    );
    console.log('getUserSettingAndDetails', response);
    if (response.status === 200) {
      //dependiing on API response parse data and set
      // setUserDetails(response.data.userData);
      dispatch(setNotificationSettings(response.data.notificationsSettings));
    }
  };
  useEffect(() => {
    phoneNumberInputRef?.current.setDisabled(true);
    phoneNumberInputRef?.current.setPhoneNumber(memberProfileData?.phoneNumber);
    // phoneNumberInputRef?.current.setCallingCode(
    //   memberProfileData.countryCallingCode,
    // );
    // phoneNumberInputRef?.current.setFlag(userDetails?.countryCodeFlag || '🇺🇸');
    emailInputRef?.current.setDisabled(true);
    emailInputRef?.current.setEmailAddress(memberProfileData?.email);

    // getUserSettingAndDetails();
  }, []);

  const onConfirmClick = async () => {
    if (
      companyNameRef.current.validateInputs() &&
      bioRef.current.validateInputs() &&
      websiteRef.current.validateBirthDate() &&
      !isToastShown
    ) {
      const requestObject: any = {
        bio: 'string',
        companyLogo: 'string',
        companyName: 'string',
        email: 'string',
        eventsPerYear: 0,
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        referredBy: 'string',
        socialMedia: {
          facebook: 'string',
          instagram: 'string',
          linkedin: 'string',
          tiktok: 'string',
          x: 'string',
          youtube: 'string',
        },
        website: 'string',
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
            ref={companyNameRef}
            label={LABLE.COMPANY_NAME}
            errorMessage={ERROR_MESSAGE.COMPANY_NAME_ERROR}
            defaultValue={memberProfileData?.companyName}
          />
          <Text style={[styles.label]}>{LABLE.BIO}</Text>
          <View
            style={[
              styles.textareaContainer,
              errorMessage ? styles.errorInputWrapper : null,
            ]}>
            <TextInput
              style={styles.textArea}
              placeholder="Description of Company"
              placeholderTextColor="#c4c4c4"
              multiline
              numberOfLines={6}
              value={bio}
              onChangeText={text => setBio(text)}
            />
          </View>
          <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
          <EmailInput ref={emailInputRef} />
          <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
          <PhoneNumberInput ref={phoneNumberInputRef} />

          <Input
            ref={companyNameRef}
            label={LABLE.WEBSITE}
            errorMessage={ERROR_MESSAGE.FIRST_NAME}
            defaultValue={memberProfileData?.websiteURL}
          />
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
    marginTop: verticalMarginScale(20),
    marginBottom: verticalMarginScale(20),
    borderRadius: radiusScale(100),
    bottom: Platform.OS === 'android' ? verticalMarginScale(20) : 0,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: verticalMarginScale(10),
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
  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    padding: verticalMarginScale(10),
    backgroundColor: COLORS.white,
    // marginVertical: verticalMarginScale(10),
    width: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
    fontSize: fontScale(16),
    color: '#333',
    height: verticalScale(100),
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
});

export default HostEditProfileScreen;

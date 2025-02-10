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
import Toast from 'src/component/Toast/Toast';
import {setNotificationSettings} from '../../../redux/slices/appSettingsSlice';
import {setHostProfileData} from 'src/redux/slices/appGlobalDataSlice';

interface HostEditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const HostEditProfileScreen: React.FC<HostEditProfileScreenProps> = ({
  navigation,
}) => {
  const {apiRequest, loading, error} = useApi();
  const dispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [errorMessage, setErrorMessage] = useState('');
  const [bio, setBio] = useState('');
  const [hostdetails, setHostDetails] = useState<any>();
  const companyNameRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const websiteRef = useRef<any>(null);

  const getHostDetails = async () => {
    const response: any = await apiRequest(
      'get',
      `v1/auth/host/${loginData?.id}/profile`,
    );
    console.log('getHostDetails', response);
    if (response.status === 200) {
      //dependiing on API response parse data and set
      dispatch(setHostProfileData(response.data));
      setHostDetails(response?.data);
    }
  };
  useEffect(() => {
    phoneNumberInputRef?.current.setDisabled(true);
    phoneNumberInputRef?.current.setPhoneNumber(hostdetails?.phoneNumber);
    // phoneNumberInputRef?.current.setCallingCode(
    //   memberProfileData.countryCallingCode,
    // );
    // phoneNumberInputRef?.current.setFlag(userDetails?.countryCodeFlag || '🇺🇸');
    emailInputRef?.current.setDisabled(true);
    emailInputRef?.current.setEmailAddress(hostdetails?.email);

    getHostDetails();
  }, []);

  const onConfirmClick = async () => {
    if (!bio) {
      // setErrorMessage(ERROR_MESSAGE.FEEDBACK_ERROR);
    }
    if (
      companyNameRef.current.validateInputs() &&
      websiteRef.current.validateInputs()
    ) {
      const requestObject: any = {
        bio: bio,
        companyLogo: 'string',
        companyName: companyNameRef?.current.inputText,
        email: emailInputRef?.current.emailAddress,
        eventsPerYear: 0,
        firstName: hostdetails?.firstName,
        lastName: hostdetails?.lastName,
        phoneNumber:
          phoneNumberInputRef?.current.callingCode +
          phoneNumberInputRef?.current.phoneNumber,
        referredBy: 'string',
        socialMedia: {
          facebook: hostdetails?.socialMedia.facebook,
          instagram: hostdetails?.socialMedia.instagram,
          linkedin: hostdetails?.socialMedia.linkedin,
          tiktok: hostdetails?.socialMedia.tiktok,
          x: hostdetails?.socialMedia.x,
          youtube: hostdetails?.socialMedia.youtube,
        },
        website: websiteRef?.current.inputText,
      };

      console.log('requestObject', requestObject);

      const response: any = await apiRequest(
        'put',
        `v1/auth/host/${loginData?.id}/profile`,
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
            defaultValue={hostdetails?.companyName}
          />
          <Text style={[styles.label]}>{LABLE.BIO}</Text>
          <View
            style={[
              styles.textareaContainer,
              errorMessage ? styles.errorInputWrapper : null,
            ]}>
            <TextInput
              style={styles.textArea}
              placeholder={LABLE.COMPANY_DESCRIPTION}
              placeholderTextColor="#c4c4c4"
              multiline
              numberOfLines={6}
              value={bio}
              onChangeText={text => setBio(text)}
            />
          </View>
          {errorMessage ? (
            <Text style={[styles.errorText]}>{errorMessage}</Text>
          ) : null}
          <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
          <EmailInput ref={emailInputRef} />
          <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
          <PhoneNumberInput ref={phoneNumberInputRef} />

          <Input
            ref={websiteRef}
            label={LABLE.WEBSITE}
            errorMessage={ERROR_MESSAGE.WEBSITE_ERROR}
            defaultValue={hostdetails?.websiteURL}
          />
        </View>
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
    paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: {paddingBottom: verticalMarginScale(200)},
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(24),
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
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default HostEditProfileScreen;

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
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { extractCountryCode } from 'src/utils/functions';

interface HostEditProfileScreenProps extends NativeStackScreenProps<any, any> { }

const HostEditProfileScreen: React.FC<HostEditProfileScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );
  // const [hostdetails, setHostDetails] = useState<any>();
  const companyNameRef = useRef<any>(null);
  const bioRef = useRef<any>(null);
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const websiteRef = useRef<any>(null);


  useEffect(() => {
         const phoneNumberDetails = extractCountryCode(profileData?.phoneNumber);
         phoneNumberInputRef?.current.setPhoneNumber(profileData?.phoneNumber);
         phoneNumberInputRef?.current.setFlag(phoneNumberDetails?.flag);
         phoneNumberInputRef?.current.setCallingCode(null);
         phoneNumberInputRef?.current.setDisabled(true);
         emailInputRef?.current.setEmailAddress(profileData?.email);
         emailInputRef?.current.setDisabled(true);
    // getHostDetails();
  }, []);

  const validateLength = () => {
      const regex = /^\s*(\S+\s*){0,200}$/;
       if(!regex.test(bioRef?.current.inputText)){
        bioRef?.current?.setErrorMessage(
                  ERROR_MESSAGE.DESCRIPTION_SIZE_EXCEED,
                );
                return false;
       }
       bioRef?.current?.setErrorMessage('');
       return true;
    };
  const onConfirmClick = async () => {

    if (
      companyNameRef.current.validateInputs() && validateLength() &&
      websiteRef.current.validateInputs()
    ) {
      console.log("inside")
      const requestObject: any = {
        bio: bioRef?.current.inputText,
        companyName: companyNameRef?.current.inputText,
        email: profileData?.email,
        eventsPerYear: 0,
        firstName: profileData?.firstName,
        lastName: profileData?.lastName,
        phoneNumber: profileData?.phoneNumber,
        socialMedia: {
          facebook: profileData?.socialMedia.facebook,
          instagram: profileData?.socialMedia.instagram,
          linkedin: profileData?.socialMedia.linkedin,
          tiktok: profileData?.socialMedia.tiktok,
          x: profileData?.socialMedia.x,
          youtube: profileData?.socialMedia.youtube,
        },
        website: websiteRef?.current.inputText,
      };
      console.log("requestobj", requestObject)
      const response: any = await apiRequest(
        'put',
        `v1/auth/host/${userId}/profile`,
        requestObject,
      );
      if (response.status === 200) {
        const responseUser: any = await apiRequest(
          'get',
          `v1/auth/host/${userId}/profile`,
        );
        if (responseUser.status === 200) {
          dispatch(setProfileData(responseUser.data));
        }
        FlashMessageComponent.show('success', LABLE.PROFILE_UPDATED_SUCCESSFULLY)
        handleBackPress()
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
         <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentContainer}>
          <Input
            ref={companyNameRef}
            label={LABLE.COMPANY_NAME}
            errorMessage={ERROR_MESSAGE.COMPANY_NAME_ERROR}
            defaultValue={profileData?.companyName}
            maxLength={100}
          />
          <Input
            blurOnSubmit={true}
            ref={bioRef}
            label={LABLE.BIO}
            errorMessage={''}
            defaultValue={profileData?.bio}
            multiline={true}
          />
          <Text style={[styles.label]}>{LABLE.EMAIL_ADDRESS}</Text>
          <EmailInput ref={emailInputRef} />
          <Text style={[styles.label]}>{LABLE.PHONE_NUMBER}</Text>
          <PhoneNumberInput ref={phoneNumberInputRef} />

          <Input
            ref={websiteRef}
            label={LABLE.WEBSITE}
            errorMessage={ERROR_MESSAGE.WEBSITE_ERROR}
            defaultValue={profileData?.website}
          />
        </View>
        </KeyboardAvoidingView>
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
  scrollContainer: { paddingBottom: verticalMarginScale(200) },
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

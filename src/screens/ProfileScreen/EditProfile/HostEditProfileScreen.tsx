import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
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
  LABLE,
  PROFILE,
} from '../../../utils/constants';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { extractCountryCode } from 'src/utils/functions';
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
  verticalScale,
} from '../../../utils/dimensions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import {
  BOTTOM_SAFEAREA_SPACING,
  TOP_SAFEAREA_SPACING,
} from 'src/component/Wrappers/SafeAreaViewWrapper';
import { isIPad } from 'src/utils/isTabletConfig';

interface HostEditProfileScreenProps extends NativeStackScreenProps<any, any> {}

const HostEditProfileScreen: React.FC<HostEditProfileScreenProps> = ({
  navigation,
}) => {
  const { keyboardVisible } = useKeyboard();
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
    if (!regex.test(bioRef?.current.inputText)) {
      bioRef?.current?.setErrorMessage(ERROR_MESSAGE.DESCRIPTION_SIZE_EXCEED);
      return false;
    }
    bioRef?.current?.setErrorMessage('');
    return true;
  };
  const onConfirmClick = async () => {
    if (
      companyNameRef.current.validateInputs() &&
      validateLength() &&
      websiteRef.current.validateInputs()
    ) {
      const requestObject: any = {
        bio: bioRef?.current.inputText,
        companyName: companyNameRef?.current.inputText,
        website: websiteRef?.current.inputText,
      };
      const response: any = await apiRequest(
        'put',
        `${EndPoint.host_ep}`,
        requestObject,
      );
      if (response.success) {
        const responseUser: any = await apiRequest(
          'get',
          `${EndPoint.host_ep}`,
        );
        if (responseUser.success) {
          dispatch(setProfileData(responseUser.data));
        }
        FlashMessageComponent.show(
          'success',
          LABLE.PROFILE_UPDATED_SUCCESSFULLY,
        );
        handleBackPress();
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        headerTitle={PROFILE.EDIT_PROFILE}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        contentContainerStyle={styles.container}>
        <ScrollView style={styles.scrollContainer}>
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
            hasHandler={true}
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
            isUrl={true}
            otherStyle={{ marginBottom: verticalScale(100) }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.ADD}
          colorTheme="dark"
          onPress={onConfirmClick}
          loading={loading}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    // width: Wp(85),
    // height: 50,
    marginTop: verticalMarginScale(20),
    borderRadius: radiusScale(100),
    marginBottom: BOTTOM_SAFEAREA_SPACING,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: {
    paddingVertical: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(20),
  },
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

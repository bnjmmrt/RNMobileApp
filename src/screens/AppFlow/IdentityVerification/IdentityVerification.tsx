import React, { useCallback, useRef } from 'react';
import { ScrollView, Text, View, Linking, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE, BUTTON_LABLE, genderList, COLORS } from '../../../utils/constants';
import IdentityVerificationStyles from './IdentityVerificationStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetAppFlowDetails,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import Input from '../../../component/Input/Input';
import IMAGES from '../../../assets/images';
import { useMemberSignUp } from '../../../redux/hooks/useMemberSignUp';
import useApi from '../../../axios/useApi';
import { EndPoint } from '../../../ApiManager/config';
import { changeSafeAreaViewConfig, convertDateFormat } from '../../../utils/functions';
import {
  setAuthToken,
  setLoginData,
  setRole,
  setUserId,
} from '../../../redux/slices/authSlice';
import { FlashMessageComponent } from '../../../component/FlashMessageComponent/FlashMessageComponent';
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { fontScale, horizontalScale, Hp, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';

interface IdentityVerificationProps extends NativeStackScreenProps<any, any> { }

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  navigation,
}) => {
  const { signUp } = useMemberSignUp();
  const { apiRequest, loading, error } = useApi();
  const userDetails = useSelector((state: any) => state.appFlow);
  const loginData = useSelector((state: any) => state.auth.loginData);
  const styles = IdentityVerificationStyles();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);
  const email = BUTTON_LABLE.SUPPORT_EMAIL_ID;
  const subject = BUTTON_LABLE.MAIL_SUBJECT;
  const body = BUTTON_LABLE.MAIL_BODY;
  const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const onNextClick = async () => {

    const requestParams: any = {
      address: {
        address: userDetails.baseCity.address,
        placeId: userDetails.baseCity.placeId,
      },
      dateOfBirth: convertDateFormat(userDetails.birthday),
      email: userDetails.email,
      firstName: userDetails.firstName,
      focusIds: userDetails.creativeFocus.map((item: any) => item.id),
      interestsIds: userDetails.interest.map((item: any) => item.id),
      gender: userDetails.gender,
      lastName: userDetails.lastName,
      phoneNumber: userDetails.phone ? userDetails.phone : loginData.phone,
      instagramAccessToken: '',
      instagramUserName: usernameRef.current.inputText,
      linkedInAccessToken: '',
      facebookAccessToken: '',
      platform: Platform.OS,
      socialUrl: '',
      profilePicture: userDetails.profilePic,
    };
    const response: any = await apiRequest(
      'post',
      EndPoint.member_signUp,
      requestParams,
    );
    console.log("response", response)
    if (response.status === 200) {
      const data = {
        ...loginData,
        roles: response?.data.roles,
        token: response.data.token,
        isSignUpCompleted: true,
        userId: response?.data?.id,
      };

      const userProfile = {
        dateOfBirth: userDetails.birthday,
        email: userDetails.email,
        firstName: userDetails.firstName,
        focuses: [],
        gender: genderList.find(item => item.id === userDetails.gender)?.value,

        id: response?.data?.id,
        imageUrl: userDetails.profilePic,
        interest: '',
        lastName: userDetails.lastName,

        phoneNumber: userDetails.phone ? userDetails.phone : loginData.phone,
        role: response?.data?.roles[0]?.roleName,
      };
      dispatch(setProfileData(userProfile));
      dispatch(setLoginData(data));
      dispatch(setUserId(data?.userId));
      dispatch(setRole(data?.roles[0]?.roleName));
      dispatch(setAuthToken(data?.token || ''));
      dispatch(resetAppFlowDetails());
      dispatch(setPageProgress(1));
      dispatch(setAuthToken(response.data.token));
      navigation.navigate('BottomTabBar');

      // dispatch(resetAppFlowDetails());
      // persistStore(store).purge(); // This clears the persisted state
    } else {
      FlashMessageComponent.show(
        'error',
        'Something went wrong, please try again!',
      );
      // console.error('Error verifying OTP:', error);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(8));
    navigation.goBack();
  };

  const goToInstagram = () => {
    Linking.openURL('https://www.instagram.com/therumor/');
  };

  const goToEmail = () => {
    Linking.openURL(mailtoURL);
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle={LABLE.IDENTITY_VERIFICATION}
        onPress={handleBackPress}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        style={styles.contentContainer}>
        <Title
          title={LABLE.IDENTITY_VERIFICATION_TITLE}
          subTitle={LABLE.IDENTITY_VERIFICATION_SUBTITLE}
        />
        <Input
          ref={usernameRef}
          placeholder={'@username'}
          leftImage={IMAGES.instagramLogo}
          // iconStyle={styles.iconStyle}
          errorMessage={'Please enter username'}
          defaultValue={''}
        />
        <View style={styles.mainContainer}>
          <Text style={styles.title}>{LABLE.COMPLETE_VERIFICATION}</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={styles.subTitle}>{LABLE.SEND_DIRECT_MSG_CODE}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: verticalMarginScale(5) }}>
            <View style={{
              paddingVertical: verticalScale(5), backgroundColor: COLORS.tabBorderColor, borderRadius: 5,
              paddingHorizontal: horizontalScale(5), alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
            }}>
              <Text style={{
                color: COLORS.black,
                fontSize: fontScale(11),
              }}>{LABLE.RUMORAPP}</Text>
            </View>

            <Text style={styles.subTitle}>{'to'}</Text>
            <Text style={styles.emailStyle}>@therumor</Text>
          </View>


          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <Text style={styles.subTitle}>{LABLE.WE_WILL_REVIEW_APP}</Text>

          <Button
            disabled={false}
            style={styles.btnSmallStyle}
            title={BUTTON_LABLE.GO_TO_INSTAGRAM}
            colorTheme="light"
            onPress={goToInstagram}
          />
          <View style={styles.divider} />
          <Text style={[styles.title, { marginVertical: 20 }]}>
            {LABLE.DONT_USE_INSTAGRAM}
          </Text>
          <Text style={styles.subTitle}>{LABLE.EMAIL_THE_CODE}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: verticalMarginScale(5) }}>
            <View style={{
              paddingVertical: verticalScale(5), backgroundColor: COLORS.tabBorderColor, borderRadius: 5,
              paddingHorizontal: horizontalScale(5), alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
            }}>
              <Text style={{
                color: COLORS.black,
                fontSize: fontScale(11),
              }}>{LABLE.RUMORAPP}</Text>
            </View>

            <Text style={styles.subTitle}>{'to'}</Text>
            <Text style={styles.emailStyle}> {BUTTON_LABLE.SUPPORT_EMAIL_ID}</Text>
          </View>

          <Button
            disabled={false}
            style={styles.btnSmallStyle}
            title={BUTTON_LABLE.SEND_EMAIL}
            colorTheme="light"
            onPress={goToEmail}
          />
        </View>
      </ScrollView>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMTI_APPLICATION}
        colorTheme="dark"
        loading={loading}
        onPress={onNextClick}
      />
    </View>
  );
};

export default IdentityVerification;

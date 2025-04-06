/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { EndPoint } from '../../../ApiManager/config';
import IMAGES from '../../../assets/images';
import useApi from '../../../axios/useApi';
import Button from '../../../component/Button';
import { FlashMessageComponent } from '../../../component/FlashMessageComponent/FlashMessageComponent';
import Header from '../../../component/Header/Header';
import Input from '../../../component/Input/Input';
import Title from '../../../component/Title/Title';
import {
  resetAppFlowDetails,
  setPageProgress,
} from '../../../redux/slices/appFlowSlice';
import { role, setRole, setRoleId } from '../../../redux/slices/authSlice';
import {
  BUTTON_LABLE,
  COLORS,
  genderList,
  LABLE,
} from '../../../utils/constants';
import {
  changeSafeAreaViewConfig,
  convertDateFormat,
  fontFamily,
  loginUser,
  removeSpaceFromStr,
} from '../../../utils/functions';
import IdentityVerificationStyles from './IdentityVerificationStyles';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

interface IdentityVerificationProps extends NativeStackScreenProps<any, any> { }

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  navigation,
}) => {
  const { keyboardVisible } = useKeyboard();
  const { apiRequest, loading } = useApi();
  const userDetails = useSelector((state: any) => state.appFlow);
  const loginData = useSelector((state: any) => state.auth.loginData);
  const styles = IdentityVerificationStyles();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);
  const [noInstagram, setNoInstagram] = useState(false);
  const [showError, setShowError] = useState(false);

  const { companyLogo, isGuest, varifyStatus } = useSelector(
    (state: RootState) => ({
      companyLogo: state.auth.companyLogo,
      isGuest: state.auth.isGuest,
      varifyStatus: state.auth.varifyStatus,
    }),
    shallowEqual,
  );

  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const deviceId = useSelector((state: RootState) => state.auth.deviceId);

  const handleInstagramInput = (text: string) => {
    if (text) {
      setNoInstagram(false);
    }
    // if (showError) {
    //   setShowError(false);
    // }
    usernameRef.current?.setInputText(text);
  };

  const handleNoInstagramToggle = () => {
    if (usernameRef.current?.inputText) {
      return; // Don't allow checking if there's text in the input
    }
    setNoInstagram(!noInstagram);
    // if (showError) {
    //   usernameRef.current.setErr();
    //   setShowError(false);
    // }
    if (!noInstagram) {
      // If we're enabling noInstagram, clear the input
      usernameRef.current?.setInputText('');
      usernameRef.current?.setErrorMessage('');
    }
  };

  const onNextClick = async () => {
    if (!usernameRef.current?.inputText && !noInstagram) {
      // setShowError(true);
      usernameRef.current.validateInputs();

      return;
    }

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
      phoneNumber: userDetails.phone
        ? removeSpaceFromStr(userDetails.phone)
        : removeSpaceFromStr(loginData.phone),
      instagramAccessToken: '',
      instagramUserName: usernameRef?.current?.inputText || '',
      linkedInAccessToken: '',
      facebookAccessToken: '',
      platform: Platform.OS,
      socialUrl: '',
      profilePicture: userDetails.profilePic,
      imageUrl: userDetails.profilePic,
      fcmToken: fcmToken,
      deviceId: deviceId,
    };

    const response: any = await apiRequest(
      'post',
      EndPoint.member_signUp,
      requestParams,
    );
    if (response.success) {
      loginUser({
        id: response?.data?.id,
        isGuest: isGuest,
        roles: response?.data.roles,
        token: response.data.token,
        varifyStatus: varifyStatus,
        companyLogo: companyLogo,
        profilePicture: userDetails.profilePic,
      });

      let newRole = response?.data.roles[0];
      const nonMemberRole = response?.data.roles.find(
        (role: role) => role.roleName === 'non_member',
      );
      if (response?.data.roles.length > 1 && nonMemberRole) {
        newRole = nonMemberRole;
      }

      dispatch(setRole(newRole.roleName));
      dispatch(setRoleId(newRole.roleId));

      const userProfile = {
        dateOfBirth: userDetails.birthday,
        email: userDetails.email,
        firstName: userDetails.firstName,
        focuses: [],
        gender: genderList.find(item => item.id === userDetails.gender)?.gender,

        id: response?.data?.id,
        imageUrl: userDetails.profilePic,
        profilePicture: userDetails.profilePic,
        interest: '',
        lastName: userDetails.lastName,

        phoneNumber: userDetails.phone
          ? removeSpaceFromStr(userDetails.phone)
          : removeSpaceFromStr(loginData.phone),
        role: response?.data?.roles[0]?.roleName,
      };
      dispatch(setProfileData(userProfile));
      dispatch(resetAppFlowDetails());
      dispatch(setPageProgress(1));

      // navigation.navigate('BottomTabBar');
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabBar' }],
      });

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
    Linking.openURL('instagram://');
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
        contentContainerStyle={styles.scrollViewContent}
        style={styles.contentContainer}>
        <Title
          title={LABLE.IDENTITY_VERIFICATION_TITLE}
          subTitle={LABLE.IDENTITY_VERIFICATION_SUBTITLE}
        />

        <Input
          otherStyle={styles.inputMarginTop}
          inputFieldContainerStyle={styles.inputFieldHeight}
          ref={usernameRef}
          isRequired={!noInstagram}
          placeholder={'@Username'}
          placeholderTextColor={COLORS.placeHodler}
          leftImage={IMAGES.instagramLogo}
          errorMessage={'Please enter username'}
          defaultValue={''}
          onChangeText={handleInstagramInput}
          editable={!noInstagram}
        />

        <View style={styles.mainContainer}>
          <Text style={styles.title}>{LABLE.COMPLETE_VERIFICATION}:</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={styles.subTitle}>{LABLE.SEND_DIRECT_MSG_CODE}</Text>
          <View style={[styles.rumorTextContainer, { marginTop: -5 }]}>
            <View style={styles.btnRumorContainer}>
              <Text style={styles.btnRumor}>{LABLE.RUMORAPP}</Text>
            </View>

            <Text style={[styles.subTitle, { paddingHorizontal: 0 }]}>
              {' to '}
            </Text>
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
        </View>

        <TouchableOpacity
          style={styles.noInstagramContainer}
          onPress={handleNoInstagramToggle}
          disabled={!!usernameRef.current?.inputText}>
          <Image
            source={
              noInstagram ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
            }
          />
          <Text style={styles.noInstagramText}>
            {LABLE.I_DONT_HAVE_INSTAGRAM}
          </Text>
        </TouchableOpacity>

        {/* {showError && (
          <View style={styles.errorContainer}>
            <Image source={IMAGES.close} />
            <Text style={styles.errorText}>Please select at least one</Text>
          </View>
        )} */}
      </ScrollView>

      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.SUBMTI_APPLICATION}
          colorTheme="dark"
          loading={loading}
          onPress={onNextClick}
        />
      ) : null}
    </View>
  );
};

export default IdentityVerification;

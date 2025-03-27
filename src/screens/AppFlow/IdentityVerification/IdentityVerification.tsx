/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { Platform, ScrollView, View } from 'react-native';
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
  loginUser,
  removeSpaceFromStr,
} from '../../../utils/functions';
import IdentityVerificationStyles from './IdentityVerificationStyles';

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
  const onNextClick = async () => {
    // Validate username first
    // if (!usernameRef.current?.validateInputs()) {
    //   return;
    // }

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

    console.log('requestParams', requestParams);
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
        gender: genderList.find(item => item.id === userDetails.gender)?.value,

        id: response?.data?.id,
        imageUrl: userDetails.profilePic,
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
          otherStyle={{ marginTop: 15 }}
          inputFieldContainerStyle={{ height: 60 }}
          ref={usernameRef}
          isRequired
          placeholder={'@Username'}
          placeholderTextColor={COLORS.placeHodler}
          leftImage={IMAGES.instagramLogo}
          errorMessage={'Please enter username'}
          defaultValue={''}
        />
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

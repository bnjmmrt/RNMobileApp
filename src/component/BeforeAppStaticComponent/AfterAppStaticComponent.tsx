/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import {
  role,
  setIsGuest,
  setRole,
  setRoles,
} from 'src/redux/slices/authSlice';
import GradientOverlay from 'src/screens/BeforeApplicationFlow/GradientOverlay';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BUTTON_LABLE, COLORS, LABLE, ROLE } from '../../utils/constants';
import {
  fontScale,
  Hp,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../utils/dimensions';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import { BottomSheetMethods } from '../BottomSheet/BottomSheet';
import Button from '../Button';
import HeaderComponent from '../HeaderComponent';
import ReferralCodeBottomSheet from '../ReferralCodeBottomSheet/ReferralCodeBottomSheet';
import MiddleStaticComponent from '../TitleSubTitleComponent/MiddleStaticComponent';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { useGetUserWithRolesByIdMutation } from 'src/redux/actions/inviteGuestsApiAction';
import { navigate } from '../NavigationService';
import useApi from 'src/axios/useApi';

const AfterAppStaticComponent: React.FC<{}> = () => {
  const navigation = useNavigation();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);
  const [getUserById] = useGetUserWithRolesByIdMutation();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const dispatch = useDispatch();

  const onAccessContactClick = async () => {
    (navigation as any).navigate('InviteReferralScreen');
  };

  const { apiRequest } = useApi<any>();

  const checkCommunityGuidelinesStatus = async () => {
    try {
      const response: any = await apiRequest(
        'get',
        `/auth/user/${userId}/community-guidelines-status`,
      );
      const agreed = (response as any).data.agreed;

      return agreed;
    } catch (error) {
      console.error('Error checking community guidelines status:', error);
      return false;
    }
  };

  const fetchUserById = async () => {
    try {
      const response = await getUserById({ id: userId }).unwrap();
      if (response.success) {
        const { roles, name, isGuest } = response.data;

        const transformedRoles = roles.map((role: any) => ({
          roleName: role.name,
          roleId: role.id,
          roleStatus: role.status,
        }));
        dispatch(setRoles(transformedRoles));

        const isMember = transformedRoles.some(
          (role: role) => role.roleName === ROLE.MEMBER,
        );
        if (isMember) {
          const hasAgreed = await checkCommunityGuidelinesStatus();
          if (hasAgreed) {
            navigate('AppStack', { screen: 'BottomTabBar' });
          } else {
            navigate('CommunityGuidelinesScreen', { userName: name });
          }
          dispatch(setRole(ROLE.MEMBER));
        } else {
          dispatch(setIsGuest(isGuest || false));
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (role === ROLE.NON_MEMBER) {
        fetchUserById();
      }
    }, [role]),
  );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
        statusBarStyle: 'light-content',
      });
    }, []),
  );

  const onEnterReferralClick = () => {
    bottomSheetRef?.current?.open();
  };

  return (
    <>
      <View style={styles.container}>
        <GradientOverlay />
        <ScrollView>
          <View
            style={[
              styles.contentContainer,
              {
                paddingTop:
                  Platform.OS === 'ios'
                    ? verticalScale(60)
                    : StatusBar.currentHeight,
              },
            ]}>
            <HeaderComponent isDarkTheme={true} hasGradient={true} />

            <View style={{ height: 30, width: '100%' }} />

            <TitleSubtitle
              style={{
                paddingHorizontal: 20,
                marginTop: verticalMarginScale(12),
              }}
              title={LABLE.YOU_ARE_ON_WAITLIST}
              subTitle={LABLE.FULL_ACCESS_UNLOCK}
              centerTextAlign={true}
              isDarkTheme={true}
              titleFontSize={fontScale(40)}
              subTitleTextstyle={{ color: COLORS.light_text }}
            />

            <MiddleStaticComponent
              style={{ marginTop: verticalMarginScale(16) }}
            />

            <View
              style={{
                marginTop: verticalMarginScale(24),
                gap: verticalMarginScale(8),
              }}>
              <Button
                disabled={false}
                style={styles.btnStyle}
                title={BUTTON_LABLE.ACCESS_MY_CONTACTS}
                colorTheme={'light'}
                onPress={() => onAccessContactClick()}
              />
              <Button
                disabled={false}
                style={styles.btnStyle}
                title={BUTTON_LABLE.ENTER_REFERRAL_CODE}
                colorTheme={'light'}
                onPress={onEnterReferralClick}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <ReferralCodeBottomSheet ref={bottomSheetRef} />
    </>
  );
};

export default AfterAppStaticComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logoImgStyle: {
    width: 100,
    height: 50,
    resizeMode: 'center',
  },
  textBelowStyle: {
    color: COLORS.light_gray,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
  },
});

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import {
  BUTTON_LABLE,
  COLORS,
  eventData,
  LABLE,
  ROLE,
} from '../../utils/constants';
import Button from '../Button';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import HeaderComponent from '../HeaderComponent';
import ReferralCodeBottomSheet from '../ReferralCodeBottomSheet/ReferralCodeBottomSheet';
import MiddleStaticComponent from '../TitleSubTitleComponent/MiddleStaticComponent';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useContacts from 'src/utils/hooks/useContactPermission';
import { useDispatch, useSelector } from 'react-redux';
import useApi from 'src/axios/useApi';
import { RootState } from 'src/redux/slices';
import GradientOverlay from 'src/screens/BeforeApplicationFlow/GradientOverlay';
import { ROUTES } from 'src/navigation/Route';
import { EndPoint } from 'src/ApiManager/config';
import { setRole } from 'src/redux/slices/authSlice';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BottomSheetMethods } from '../BottomSheet/BottomSheet';

const AfterAppStaticComponent: React.FC<{}> = () => {
  const { requestContactPermission } = useContacts();
  const { navigate } = useNavigation();
  const { apiRequest, loading, error } = useApi();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const dispatch = useDispatch();

  const onAccessContactClick = async () => {
    await requestContactPermission();
    navigate('InviteReferralScreen');
  };

  console.log('llll');

  useFocusEffect(
    useCallback(() => {
      const fetchUserById = async () => {
        try {
          const response: any = await apiRequest(
            'post',
            EndPoint.get_user_with_role_by_id,
            { id: userId },
          );
          if (response.status === 200) {
            if (
              response.data.roles[0].roleName == ROLE.MEMBER ||
              response.data.roles[0].name == ROLE.MEMBER
            ) {
              navigate(ROUTES.WelcomeScreen, { userName: response?.data.name });
              dispatch(setRole(response?.data?.roles[0].name));
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      role == ROLE.NON_MEMBER && fetchUserById();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.STATIC_GRADIENT_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  const onEnterReferralClick = () => {
    bottomSheetRef?.current?.open();
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <GradientOverlay />
        <ScrollView>
          <View style={styles.contentContainer}>
            <HeaderComponent isDarkTheme={true} hasGradient={true} />

            <View style={{ height: Hp(5) }} />

            <TitleSubtitle
              style={{ paddingHorizontal: 20, marginTop: 20 }}
              title={LABLE.YOU_ARE_ON_WAITLIST}
              subTitle={LABLE.FULL_ACCESS_UNLOCK}
              centerTextAlign={true}
              isDarkTheme={true}
              titleFontSize={36}
              subTitleTextstyle={{ color: COLORS.light_text }}
            />

            <MiddleStaticComponent style={{ marginTop: 20 }} />

            <View style={{ height: Hp(4) }} />

            <Button
              disabled={false}
              style={styles.btnStyle}
              title={BUTTON_LABLE.ACCESS_MY_CONTACTS}
              colorTheme={'light'}
              onPress={() => onAccessContactClick()}
            />
            <View style={{ height: Hp(1) }} />

            <Button
              disabled={false}
              style={styles.btnStyle}
              title={BUTTON_LABLE.ENTER_REFERRAL_CODE}
              colorTheme={'light'}
              onPress={onEnterReferralClick}
            />
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
    // backgroundColor: COLORS.black2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 30
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

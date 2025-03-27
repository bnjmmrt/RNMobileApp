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
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import { ROUTES } from 'src/navigation/Route';
import { RootState } from 'src/redux/slices';
import { role, setRole, setRoles } from 'src/redux/slices/authSlice';
import GradientOverlay from 'src/screens/BeforeApplicationFlow/GradientOverlay';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BUTTON_LABLE, COLORS, LABLE, ROLE } from '../../utils/constants';
import { Hp, verticalScale, Wp } from '../../utils/dimensions';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import { BottomSheetMethods } from '../BottomSheet/BottomSheet';
import Button from '../Button';
import HeaderComponent from '../HeaderComponent';
import ReferralCodeBottomSheet from '../ReferralCodeBottomSheet/ReferralCodeBottomSheet';
import MiddleStaticComponent from '../TitleSubTitleComponent/MiddleStaticComponent';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';

const AfterAppStaticComponent: React.FC<{}> = () => {
  const { navigate } = useNavigation();
  const { apiRequest, loading, error } = useApi();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const dispatch = useDispatch();

  const onAccessContactClick = async () => {
    navigate('InviteReferralScreen');
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserById = async () => {
        try {
          const response: any = await apiRequest(
            'post',
            EndPoint.get_user_with_role_by_id,
            { id: userId },
          );

          if (response.success) {
            const { roles, name } = response.data;

            const transformedRoles = roles.map((role: any) => ({
              roleName: role.name,
              roleId: role.id,
            }));

            const isMember = transformedRoles.some(
              (role: role) => role.roleName === ROLE.MEMBER,
            );

            if (isMember) {
              navigate(ROUTES.WelcomeScreen, { userName: name });
              dispatch(setRole(ROLE.MEMBER));
              dispatch(setRoles(transformedRoles));
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      if (role === ROLE.NON_MEMBER) {
        fetchUserById();
      }
    }, [role, userId, dispatch]),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUserById = async () => {
  //       try {
  //         const response: any = await apiRequest(
  //           'post',
  //           EndPoint.get_user_with_role_by_id,
  //           { id: userId },
  //         );
  //         if (response.success) {

  //           if (response.data.roles > 1) {
  //             if (
  //               response.data.roles[0].roleName == ROLE.MEMBER ||
  //               response.data.roles[0].name == ROLE.MEMBER ||
  //               response.data.roles[1].roleName == ROLE.MEMBER ||
  //               response.data.roles[1].name == ROLE.MEMBER
  //             ) {
  //               navigate(ROUTES.WelcomeScreen, { userName: response?.data.name });
  //               dispatch(setRole(ROLE.MEMBER));
  //             }

  //           }

  //           if (
  //             response.data.roles[0].roleName == ROLE.MEMBER ||
  //             response.data.roles[0].name == ROLE.MEMBER
  //           ) {
  //             navigate(ROUTES.WelcomeScreen, { userName: response?.data.name });
  //             dispatch(setRole(ROLE.MEMBER));
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user:', error);
  //       }
  //     };

  //     role == ROLE.NON_MEMBER && fetchUserById();
  //   }, []),
  // );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.STATIC_GRADIENT_SCHEME,
        showBottomSafeAreaView: false,
        showTopSafeAreaView: false,
        translucent: true,
        topSafeAreaViewColor: 'transparent',
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

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, eventData, LABLE } from '../../utils/constants';
import Button from '../Button';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { fontFamily } from '../../utils/functions';
import HeaderComponent from '../HeaderComponent';
import ReferralCodeBottomSheet from '../ReferralCodeBottomSheet/ReferralCodeBottomSheet';
import MiddleStaticComponent from '../TitleSubTitleComponent/MiddleStaticComponent';
import { useNavigation } from '@react-navigation/native';
import useContacts from 'src/utils/hooks/useContactPermission';
import { useDispatch, useSelector } from 'react-redux';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { setIsFirstTimeLoggedIn, setMemberProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { RootState } from 'src/redux/slices';
import GradientOverlay from 'src/screens/BeforeApplicationFlow/GradientOverlay';
import { ROUTES } from 'src/navigation/Route';


const AfterAppStaticComponent: React.FC<{}> = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const { requestContactPermission } = useContacts();
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { apiRequest, loading, error } = useApi();


  const bottomSheetRef = useRef(null);


const fetchCurrentUser = async () => {
    //token is reqired to run this API 
    const response: any = await apiRequest('get', EndPoint.current_user);
    if (response.status === 200) {
      dispatch(setMemberProfileData(response?.data[0].memberProfile))
    }
  };
//  const fetchUserById = async () => {
//     const response: any = await apiRequest('post', EndPoint.get_user_with_role_by_id,{id:loginData?.id});
//     if (response.status === 200) {
//       dispatch(setIsFirstTimeLoggedIn(response.data.isFirstTimeLoggedIn))
//     }
//   };
  
  useEffect(()=>{
        // fetchUserById(); //return isFirstTimeLoggedIn flag 
         fetchCurrentUser();// fetch current user details
  },[])

  const onAccessContactClick = async () => {
    await requestContactPermission();
    navigate('InviteReferralScreen')
  }

  const handlEventPress = () => {
    navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: eventData
    });
  };

  const onEnterReferralClick = () => {
    bottomSheetRef?.current?.open();
  }

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <GradientOverlay />
      <ScrollView >
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
      <ReferralCodeBottomSheet ref={bottomSheetRef} />

    </SafeAreaView>
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
    flexDirection: 'column', alignItems: 'center',
    // paddingTop: 30
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center', marginTop: 10, marginBottom: 10
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

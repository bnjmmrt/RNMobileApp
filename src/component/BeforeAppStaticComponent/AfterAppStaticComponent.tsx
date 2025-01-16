import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS } from '../../utils/constants';
import Button from '../Button';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../HeaderComponent';
import ReferralCodeBottomSheet from '../ReferralCodeBottomSheet/ReferralCodeBottomSheet';
import InviteReferralBottomSheet from '../InviteReferralBottomSheet/InviteReferralBottomSheet';
import MiddleStaticComponent from '../TitleSubTitleComponent/MiddleStaticComponent';

interface AfterAppStaticComponentProps {
  title: string;
  subTitle: string;
}

const AfterAppStaticComponent: React.FC<AfterAppStaticComponentProps> = ({
  title,
  subTitle,
}) => {

  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const bottomSheetInviteRef = useRef(null);

  const onAccessContactClick = () => {
    bottomSheetInviteRef.current.open();
  }
  const onEnterReferralClick = () => {
    bottomSheetRef.current.open();
  }

  return (

    <View style={styles.container}>
      <ScrollView >
        <View style={styles.contentContainer}>

          <HeaderComponent isDarkTheme={true} />

          <View style={{ height: Hp(2) }} />


          <TitleSubtitle
            style={{ paddingHorizontal: 20, marginTop: 20 }}
            title={title}
            subTitle={subTitle}
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
            onPress={onAccessContactClick}
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
      <InviteReferralBottomSheet ref={bottomSheetInviteRef} />
      <ReferralCodeBottomSheet ref={bottomSheetRef} />

    </View>
  );
};

export default AfterAppStaticComponent;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column', alignItems: 'center'
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

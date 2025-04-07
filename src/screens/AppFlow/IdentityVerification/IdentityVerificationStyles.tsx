import { Platform, StyleSheet } from 'react-native';
import {
  Wp,
  Hp,
  radiusScale,
  verticalScale,
  verticalMarginScale,
  horizontalMarginScale,
  fontScale,
  horizontalScale,
} from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const IdentityVerificationStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 0,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom: BOTTOM_SAFEAREA_SPACING,
    },
    btnSmallStyle: {
      width: 'auto',
      fontFamily: fontFamily.RomieTrial,
      height: verticalScale(40),
      borderRadius: radiusScale(100),
      alignSelf: 'center',
      backgroundColor: COLORS.tabBorderColor,
      marginTop: Hp(2),
      paddingHorizontal: 5,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
    },
    mainContainer: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
      alignItems: 'center',
      padding: verticalMarginScale(15),
      marginTop: verticalMarginScale(25),
    },
    title: {
      color: COLORS.black,
      fontSize: fontScale(20),
      fontFamily: fontFamily.RomieTrial_Bold,
    },
    subTitle: {
      color: COLORS.light_gray,
      fontSize: fontScale(14),
      fontFamily: fontFamily.ABCDiatype_Regular,
      marginVertical: Hp(0.5),
      textAlign: 'center',
      paddingHorizontal: horizontalMarginScale(10),
    },
    numberContainer: {
      height: verticalScale(20),
      width: horizontalScale(20),
      borderRadius: radiusScale(10),
      backgroundColor: COLORS.surfaceSecondary,
      fontSize: fontScale(14),
      marginTop: Hp(1.5),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    numberText: {
      color: COLORS.black,
      fontSize: fontScale(14),
      fontFamily: fontFamily.ABCDiatype_Regular,
      textAlign: 'center',
    },
    btnRumor: {
      color: COLORS.black,
      fontSize: fontScale(11),
      fontWeight: '500',
    },
    iconStyle: {
      height: verticalMarginScale(20),
      width: horizontalMarginScale(20),
      resizeMode: 'contain',
    },
    emailStyle: {
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    divider: {
      height: 0.5,
      backgroundColor: COLORS.tabBorderColor,
      width: horizontalScale(200),
      marginTop: verticalMarginScale(20),
    },
    btnRumorContainer: {
      backgroundColor: COLORS.lighter_gray,
      borderRadius: 5,
      padding: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rumorTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noInstagramContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalMarginScale(14),
      borderWidth: 1,
      borderRadius: radiusScale(16),
      paddingHorizontal: horizontalMarginScale(16),
      paddingVertical: verticalMarginScale(12),
      borderColor: COLORS.borderGray,
    },
    noInstagramText: {
      marginLeft: 8,
      fontSize: fontScale(14),
      color: COLORS.DARK,
      fontWeight: '400',
      fontFamily: fontFamily.ABCDiatype_Regular,
    },
    errorContainer: {
      backgroundColor: COLORS.bgRed,
      padding: verticalMarginScale(16),
      marginTop: verticalMarginScale(16),
      borderRadius: radiusScale(8),
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      color: COLORS.DARK,
      fontSize: fontScale(14),
      marginLeft: horizontalMarginScale(8),
      fontFamily: fontFamily.ABCDiatype_Regular,
    },
    rumorTextContainerAdjusted: {
      marginTop: -5,
    },
    subTitleNoPadding: {
      paddingHorizontal: 0,
    },
    scrollViewContent: {
      paddingBottom: 50,
    },
    inputMarginTop: {
      marginTop: 15,
    },
    inputFieldHeight: {
      height: 60,
    },
  });
};

export default IdentityVerificationStyles;

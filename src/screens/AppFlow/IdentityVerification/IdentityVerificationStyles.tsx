import { Platform, StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalScale, verticalMarginScale, horizontalMarginScale, fontScale, horizontalScale } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';

const ProfilePhotoScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 20,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom: Platform.OS === 'android' ? 20 : 0
    },
    btnSmallStyle: {
      width: 'auto',
      height: verticalScale(40),
      borderRadius: radiusScale(100),
      alignSelf: 'center',
      backgroundColor: COLORS.tabBorderColor,
      marginTop: Hp(1),
      paddingHorizontal: 10
    },
    contentContainer: {
      flex: 1,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
    },
    genderContainer: {
      marginTop: verticalMarginScale(10),
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genderButton: {
      paddingVertical: Hp(1.5),
      paddingHorizontal: Wp(5),
      borderRadius: radiusScale(20),
      backgroundColor: COLORS.lighter_gray,
      marginVertical: Hp(1),
      marginHorizontal: Wp(1),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
    },
    genderText: {
      fontSize: fontScale(16),
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
    mainContainer: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(8),
      alignItems: 'center',
      padding: verticalMarginScale(15),
      marginTop: verticalMarginScale(20),
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
      marginVertical: Hp(0),
      textAlign: 'center',
      paddingHorizontal: horizontalMarginScale(10)
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
      alignSelf: 'center'
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
    },
    iconStyle: {
      height: verticalMarginScale(20),
      width: horizontalMarginScale(20),
      resizeMode: 'contain',
    },
    emailStyle: {
      color: COLORS.black,
      fontWeight: 'bold',
      left: -5
    },
    divider: {
      height: 0.5,
      backgroundColor: COLORS.tabBorderColor,
      width: horizontalScale(200),
      marginTop: verticalMarginScale(20)
    }
  });
};

export default ProfilePhotoScreenStyles;

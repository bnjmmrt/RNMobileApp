import { StyleSheet } from 'react-native';
import { Wp, Hp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';

const ProfilePhotoScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
    },
    btnSmallStyle: {
      width: 'auto',
      height: 40,
      borderRadius: 100,
      alignSelf: 'center',
      backgroundColor: COLORS.tabBorderColor,
      marginTop: Hp(1),
    },
    contentContainer: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    genderContainer: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genderButton: {
      paddingVertical: Hp(1.5),
      paddingHorizontal: Wp(5),
      borderRadius: 20,
      backgroundColor: COLORS.lighter_gray,
      marginVertical: Hp(1),
      marginHorizontal: Wp(1),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
    },
    genderText: {
      fontSize: 16,
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
    mainContainer: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      alignItems: 'center',
      padding: 15,
      marginTop: 20,
    },
    title: {
      color: COLORS.black,
      fontSize: 20,
      fontFamily: fontFamily.RomieTrial_Bold,
    },
    subTitle: {
      color: COLORS.light_gray,
      fontSize: 14,
      fontFamily: fontFamily.ABCDiatype_Regular,
      marginVertical: Hp(0.15),
      textAlign: 'center',
    },
    numberContainer: {
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: COLORS.surfaceSecondary,
      fontSize: 14,
      marginTop: Hp(1),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    numberText: {
      color: COLORS.black,
      fontSize: 14,
      fontFamily: fontFamily.ABCDiatype_Regular,
      textAlign: 'center',
    },
    btnRumor: {
      color: COLORS.black,
      backgroundColor: COLORS.tabBorderColor,
      fontSize: 11,
    },
    iconStyle: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
    },
    emailStyle: {
      color: COLORS.black,
      fontWeight: 'bold'
    },
    divider: {
      height: 0.5,
      backgroundColor: COLORS.tabBorderColor,
      width: 200,
      marginTop: 20
    }
  });
};

export default ProfilePhotoScreenStyles;

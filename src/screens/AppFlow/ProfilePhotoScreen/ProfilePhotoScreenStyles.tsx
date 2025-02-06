import { Platform, StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalMarginScale, horizontalMarginScale, fontScale, verticalScale, horizontalScale } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

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
      bottom:Platform.OS==='android' ? 20 :0
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
    profilePhotoContainer: {
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: COLORS.tabBorderColor,
      alignSelf: 'center',
      justifyContent: "center",
      alignItems: "center"
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.black,
      borderRadius: 50,
      width: 32,
      height: 32,
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    ic_pencil: {
      height: verticalScale(16),
      width: horizontalScale(16),
      tintColor: COLORS.white,
    },

  });
};

export default ProfilePhotoScreenStyles;

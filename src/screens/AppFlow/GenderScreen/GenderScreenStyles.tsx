import { Platform, StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalMarginScale, horizontalMarginScale, fontScale } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const GenderScreenStyles = () => {
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
      borderRadius: radiusScale(30),
      backgroundColor: COLORS.lighter_gray,
      borderColor:COLORS.borderGray,
      borderWidth:1.5,
      marginVertical: Hp(0.25),
      marginHorizontal: Wp(0.5),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
      borderColor:COLORS.black,
    },
    genderText: {
      fontSize: fontScale(16),
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
  });
};

export default GenderScreenStyles;

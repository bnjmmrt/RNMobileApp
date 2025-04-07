import { StyleSheet } from 'react-native';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { COLORS } from '../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  Wp,
} from '../../../utils/dimensions';

const GenderScreenStyles = () => {
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
      paddingVertical: Hp(1.25),
      paddingHorizontal: Wp(5),
      borderRadius: radiusScale(30),
      backgroundColor: COLORS.lighter_gray,
      borderColor: COLORS.borderGray,
      borderWidth: 1.5,
      marginVertical: Hp(0.25),
      marginHorizontal: Wp(0.5),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
      borderColor: COLORS.black,
    },
    genderText: {
      fontSize: fontScale(14),
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
  });
};

export default GenderScreenStyles;

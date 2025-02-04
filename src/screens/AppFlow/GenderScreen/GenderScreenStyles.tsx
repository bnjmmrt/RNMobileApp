import { StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalMarginScale, horizontalMarginScale, fontScale } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const GenderScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius:radiusScale(100),
    },
    contentContainer: {
      flex: 1,
      paddingVertical:verticalMarginScale(10),
      paddingHorizontal:horizontalMarginScale(20),
    },
    genderContainer: {
      marginTop:verticalMarginScale(10),
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genderButton: {
      paddingVertical: Hp(1.5),
      paddingHorizontal: Wp(5),
      borderRadius:radiusScale(20),
      backgroundColor: COLORS.lighter_gray,
      marginVertical: Hp(1),
      marginHorizontal: Wp(1),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
    },
    genderText: {
      fontSize:fontScale(16),
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
  });
};

export default GenderScreenStyles;

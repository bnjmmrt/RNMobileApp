import { StyleSheet } from 'react-native';
import { Wp, Hp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const GenderScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
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
  });
};

export default GenderScreenStyles;

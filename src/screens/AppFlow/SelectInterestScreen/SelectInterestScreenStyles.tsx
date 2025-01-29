import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';
import { Wp } from '../../../utils/dimensions';

const CreativeFocusScreenStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10
    },
    categoryContainer: {
      marginTop: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    categoryButton: {
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 15,
      margin: 2,
      backgroundColor: COLORS.lighter_gray,
    },
    selectedCategoryButton: {
      backgroundColor: COLORS.black,
      borderColor: COLORS.black,
    },
    categoryText: {
      fontSize: 14,
      color: COLORS.black,
    },
    selectedCategoryText: {
      color: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
    },
  });

export default CreativeFocusScreenStyles;

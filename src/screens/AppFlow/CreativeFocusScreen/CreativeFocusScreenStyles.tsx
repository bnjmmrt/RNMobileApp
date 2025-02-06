import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, Wp } from '../../../utils/dimensions';

const CreativeFocusScreenStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 20,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: horizontalMarginScale(20),
      paddingVertical: verticalMarginScale(10)
    },
    categoryContainer: {
      marginTop: verticalMarginScale(20),
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    categoryButton: {
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: radiusScale(20),
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(15),
      margin: verticalMarginScale(5),
      backgroundColor: COLORS.lighter_gray,
    },
    selectedCategoryButton: {
      backgroundColor: COLORS.black,
      borderColor: COLORS.black,
    },
    categoryText: {
      fontSize: fontScale(14),
      color: COLORS.black,
    },
    selectedCategoryText: {
      color: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
    },
  });

export default CreativeFocusScreenStyles;

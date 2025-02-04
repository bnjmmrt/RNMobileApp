import { StyleSheet } from 'react-native';
import { horizontalMarginScale, radiusScale, verticalMarginScale, Wp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const MyDetailsStyles = () => {
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
  });
};

export default MyDetailsStyles;

import { Platform, StyleSheet } from 'react-native';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  Wp,
} from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const MyDetailsStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 20,
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
  });
};

export default MyDetailsStyles;

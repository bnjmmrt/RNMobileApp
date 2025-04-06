import { StyleSheet } from 'react-native';
import {
  Wp,
  Hp,
  verticalMarginScale,
  horizontalMarginScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import {
  BOTTOM_SAFEAREA_SPACING,
  TOP_SAFEAREA_SPACING,
} from 'src/component/Wrappers/SafeAreaViewWrapper';

const VerifyOtpStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentContainer: {
      flex: 1,
      paddingTop: verticalMarginScale(10),
      // paddingBottom: verticalMarginScale(20),
      paddingHorizontal: horizontalMarginScale(20),
    },
    spacer: {
      flex: 1,
    },
    btnStyle: {
      width: '100%',
      bottom: BOTTOM_SAFEAREA_SPACING,
      //   borderRadius: 100,
    },
  });
};

export default VerifyOtpStyles;

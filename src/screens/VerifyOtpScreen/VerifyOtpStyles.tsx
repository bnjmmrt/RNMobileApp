import {StyleSheet} from 'react-native';
import {
  Wp,
  Hp,
  verticalMarginScale,
  horizontalMarginScale,
} from '../../utils/dimensions';
import {fontFamily} from '../../utils/functions';
import {COLORS} from '../../utils/constants';

const VerifyOtpStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentContainer: {
      flex: 1,
      paddingTop: verticalMarginScale(16),
      paddingBottom: verticalMarginScale(8),
      paddingHorizontal: horizontalMarginScale(20),
    },
    spacer: {
      flex: 1,
    },
    btnStyle: {
      width: '100%',
      //   borderRadius: 100,
    },
  });
};

export default VerifyOtpStyles;

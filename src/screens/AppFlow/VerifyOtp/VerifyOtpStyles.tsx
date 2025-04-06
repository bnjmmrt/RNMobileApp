import { Platform, StyleSheet } from 'react-native';
import {
  Wp,
  Hp,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  fontScale,
  verticalScale,
} from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';
import { COLORS } from '../../../utils/constants';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const VerifyOtpStyles = () => {
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
      paddingTop: verticalMarginScale(0),
      paddingHorizontal: horizontalMarginScale(20),
      marginTop: 15,
    },
    title: {
      color: COLORS.black,
      fontSize: fontScale(32),
      fontFamily: fontFamily.RomieTrial_Bold,
    },
    subtitle: {
      color: COLORS.light_gray,
      fontSize: fontScale(13),
      fontFamily: fontFamily.ABCDiatype_Regular,
      marginVertical: Hp(2),
    },
    spacer: {
      flex: 1,
    },
  });
};

export default VerifyOtpStyles;

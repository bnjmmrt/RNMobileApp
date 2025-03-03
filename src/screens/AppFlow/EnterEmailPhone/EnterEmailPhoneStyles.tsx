import { Platform, StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalMarginScale, horizontalMarginScale, fontScale, verticalScale } from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';
import { COLORS } from '../../../utils/constants';

const EnterEmailPhoneStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 20,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom: 20
    },
    contentContainer: {
      flex: 1,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
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
    label: {
      // paddingVertical: horizontalMarginScale(2),
      fontSize: fontScale(14),
      paddingTop: verticalMarginScale(8),
      marginBottom: 3,
      color: COLORS.black,
      fontWeight: '500',
      lineHeight: 16,
    },
  });
};

export default EnterEmailPhoneStyles;

import { StyleSheet } from 'react-native';
import { Wp, Hp, radiusScale, verticalMarginScale, horizontalMarginScale, fontScale } from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';
import { COLORS } from '../../../utils/constants';

const EnterEmailPhoneStyles = () => {
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
    title: {
      color: COLORS.black,
      fontSize:fontScale(32),
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

export default EnterEmailPhoneStyles;

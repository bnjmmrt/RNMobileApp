import {Platform, StyleSheet} from 'react-native';
import {
  Wp,
  Hp,
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalScale,
  verticalMarginScale,
} from '../../../../utils/dimensions';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';

const createStyle = () => {
  return StyleSheet.create({
    container: {
      marginHorizontal: horizontalMarginScale(16),
      padding: horizontalMarginScale(16),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
    },
    title: {
      fontSize: fontScale(16),
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
    seprator: {
      backgroundColor: COLORS.borderGray,
      height: verticalScale(1),
      marginTop: verticalMarginScale(18),
      marginBottom: verticalMarginScale(16),
      marginHorizontal: -horizontalMarginScale(16),
    },
  });
};

export default createStyle;

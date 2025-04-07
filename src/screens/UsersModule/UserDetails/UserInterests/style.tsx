import {StyleSheet} from 'react-native';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import {COLORS} from '../../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    userIneterstsRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalMarginScale(4),
      paddingHorizontal: horizontalMarginScale(8),
      borderRadius: radiusScale(99),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
    },
    userIneterstsName: {
      color: COLORS.black,
    },
  });
};

export default createStyle;

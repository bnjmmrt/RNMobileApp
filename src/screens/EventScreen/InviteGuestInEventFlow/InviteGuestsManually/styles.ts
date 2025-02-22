import { StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    messageText: {
      color: COLORS.light_gray,
      textAlign: 'center',
      marginBottom: verticalMarginScale(16),
    },

    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: { fontFamily: fontFamily.ABCDiatype_Medium },
    phone: {
      fontSize: fontScale(12),
      color: COLORS.light_gray,
      marginTop: verticalMarginScale(4),
    },
    smallBtnStyle: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 100,
    },
  });
};

export default createStyles;

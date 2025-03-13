import { StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

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
      marginHorizontal: horizontalMarginScale(20),
    },
  });
};

export default createStyles;

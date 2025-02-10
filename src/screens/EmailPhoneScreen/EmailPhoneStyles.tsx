import { Platform, StyleSheet } from 'react-native';
import {
  Wp,
  Hp,
  horizontalMarginScale,
  verticalMarginScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

const EmailPhoneStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: '100%',
      marginBottom: verticalMarginScale(15),
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
  });
};

export default EmailPhoneStyles;

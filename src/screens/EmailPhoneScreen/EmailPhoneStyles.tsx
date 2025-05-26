import { Platform, StyleSheet } from 'react-native';
import {
  Wp,
  Hp,
  horizontalMarginScale,
  verticalMarginScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { isIPad } from '../../utils/isTabletConfig';

const EmailPhoneStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingTop: TOP_SAFEAREA_SPACING,
    },
    btnStyle: {
      width: '100%',
      marginBottom: verticalMarginScale(15),
    },
    contentContainer: {
      flex: 1,
      alignSelf: 'center',
      maxWidth: 526,
      width: '100%',
      marginHorizontal: 0,
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

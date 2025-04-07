import { StyleSheet } from 'react-native';
import { radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const createStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    username: {
      fontSize: 14,
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },

    removeCta: {
      borderRadius: radiusScale(99),
      position: 'absolute',
      bottom: BOTTOM_SAFEAREA_SPACING,
    },
  });
};

export default createStyle;

import { Platform, StyleSheet } from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const BaseCityScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 0,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom: BOTTOM_SAFEAREA_SPACING,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
    },
    spacer: {
      flex: 1,
    },
    inputContainer: {
      borderWidth: horizontalScale(1),
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      height: verticalScale(50),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalMarginScale(15),
    },
    searchImage: { marginRight: 6 },
    input: {
      width: '90%',
      fontSize: fontScale(16),
      color: COLORS.white,
    },
    errorText: {
      fontSize: fontScale(12),
      marginTop: verticalMarginScale(5),
      color: COLORS.errorText,
      position: 'absolute',
      top: 10,
    },
  });
};

export default BaseCityScreenStyles;

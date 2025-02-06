import { Platform, StyleSheet } from 'react-native';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale, Wp } from '../../../utils/dimensions';

import { COLORS } from '../../../utils/constants';

const GenderScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 20,
    },

    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom:Platform.OS==='android' ? 20 :0
    },

    contentContainer: {
      flex: 1,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
    },
    inputContainer: {
      marginTop: verticalMarginScale(20),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(8),
      height: verticalScale(50),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalMarginScale(15),
    },
    input: {
      width: '90%',
      fontSize: fontScale(16),
      color: COLORS.black,
    },
    calenderImage: { marginRight: verticalMarginScale(6), width: horizontalMarginScale(16), height: verticalMarginScale(16) },
    iconContainer: {},
  });
};

export default GenderScreenStyles;

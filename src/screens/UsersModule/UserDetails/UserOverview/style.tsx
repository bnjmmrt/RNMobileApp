import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../../../utils/dimensions';
import {fontFamily} from '../../../../utils/functions';

let screenWidth: number = Dimensions.get('window').width;
const socialPresenceCardWidth =
  screenWidth - (horizontalMarginScale(32) + horizontalMarginScale(38));

const createStyle = () => {
  return StyleSheet.create({
    sectionTitle: {
      fontSize: fontScale(12),
      color: COLORS.light_gray,
      fontFamily: fontFamily.ABCDiatype_Medium,
      marginTop: verticalMarginScale(24),
      marginBottom: verticalMarginScale(12),
    },
    infoRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(4),
      paddingVertical: verticalMarginScale(8),
    },
    infoRowIcon: {
      height: verticalScale(16),
      width: verticalScale(16),
      tintColor: COLORS.surfaceSecondary,
    },
    infoRowTitle: {
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },

    socialPresenceRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: verticalMarginScale(8),
      backgroundColor: COLORS.lighter_gray,
      borderRadius: radiusScale(99),
      justifyContent: 'center',
      width: socialPresenceCardWidth / 2,
      gap: horizontalMarginScale(4),
    },
    socialPresenceRowIcon: {
      height: verticalScale(20),
      width: verticalScale(20),
    },
    socialPresenceRowValue: {
      color: COLORS.black,
    },

    totalFollowingContainer: {
      flexDirection: 'row',
    },
    totalFollowing: {
      fontSize: fontScale(64),
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Medium,
      lineHeight: verticalScale(72),
    },
    totalFollowingUnit: {
      fontSize: fontScale(32),
      height: verticalScale(64),
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Bold,
    },
  });
};

export default createStyle;

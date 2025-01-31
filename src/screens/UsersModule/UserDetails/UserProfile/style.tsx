import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';
import {
  Wp,
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../../../utils/dimensions';
import {fontFamily} from '../../../../utils/functions';

const createStyle = () => {
  return StyleSheet.create({
    userName: {
      fontSize: fontScale(24),
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Bold,
      marginTop: verticalMarginScale(8),
      textAlign: 'center',
    },
    memberTypeWrapper: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      paddingVertical: verticalMarginScale(4),
      paddingHorizontal: horizontalMarginScale(8),
      borderRadius: 99,
      marginTop: verticalMarginScale(-10),
      backgroundColor: COLORS.white,
    },
    memberType: {
      fontSize: fontScale(12),
      color: COLORS.black,
    },

    favButtonWrapper: {
      borderTopLeftRadius: radiusScale(8),
      borderTopRightRadius: radiusScale(8),
      borderBottomLeftRadius: radiusScale(16),
      borderBottomRightRadius: radiusScale(16),
      backgroundColor: COLORS.lighter_gray,
      marginHorizontal: horizontalMarginScale(16),
      padding: horizontalMarginScale(8),
      marginTop: verticalMarginScale(2),
    },
    favButton: {
      marginHorizontal: horizontalMarginScale(8),
      width: '100%',
      borderRadius: radiusScale(99),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      paddingVertical: verticalMarginScale(12),
    },

    userActionsFloatingContainer: {
      position: 'absolute',
      right: horizontalMarginScale(8),
      top: horizontalMarginScale(8),
      flexDirection: 'row',
      gap: horizontalMarginScale(4),
    },
    userActionButton: {
      borderRadius: radiusScale(99),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      paddingVertical: verticalMarginScale(12),
      paddingHorizontal: horizontalMarginScale(16),
    },

    userTagsContainer: {
      paddingVertical: verticalMarginScale(4),
      paddingHorizontal: horizontalMarginScale(8),
      backgroundColor: COLORS.lighter_gray,
      borderRadius: radiusScale(99),
    },
    userTags: {fontSize: fontScale(12), color: COLORS.black},
  });
};

export default createStyle;

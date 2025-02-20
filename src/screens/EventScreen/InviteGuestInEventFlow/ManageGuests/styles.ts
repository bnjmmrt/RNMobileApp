import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentWrapper: {
      borderWidth: verticalScale(1),
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
      paddingHorizontal: horizontalMarginScale(16),
      paddingVertical: verticalMarginScale(16),
      marginHorizontal: horizontalMarginScale(16),
    },

    title: {
      fontSize: fontScale(18),
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    usersAvatarContainer: {
      flexDirection: 'row',
    },
    avatarContainer: {
      borderWidth: verticalScale(2),
      borderColor: COLORS.white,
    },

    accordianArrowContainer: {
      height: verticalScale(32),
      width: verticalScale(32),
      borderRadius: radiusScale(32),
      backgroundColor: COLORS.lighter_gray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inviteDetailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: verticalScale(1),
      borderBottomColor: COLORS.borderGray,
      paddingBottom: verticalMarginScale(12),
    },

    label: {
      paddingBottom: horizontalMarginScale(2),
    },

    inviteMessageInputContainer: {
      borderWidth: verticalScale(1),
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
    },
    inviteMessagePrototype: {
      marginHorizontal: horizontalMarginScale(16),
      marginVertical: verticalMarginScale(16),
    },
    seperator: {
      borderBottomWidth: verticalScale(1),
      borderBottomColor: COLORS.tabBorderColor,
    },

    bypassLabel: {
      fontSize: fontScale(14),
    },
    bypassTextContainer: {
      marginTop: verticalMarginScale(6),
      backgroundColor: COLORS.bgBlue,
      alignSelf: 'flex-start',
      paddingHorizontal: horizontalMarginScale(8),
      paddingVertical: verticalMarginScale(4),
      borderRadius: radiusScale(99),
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(8),
    },
    bypassText: {
      fontSize: fontScale(11),
      color: COLORS.blueDark,
    },
    bypassInfo: {
      height: verticalScale(16),
      width: verticalScale(16),
      tintColor: COLORS.blueDark,
    },
    undoCta: {
      backgroundColor: undefined,
      width: undefined,
      height: undefined,
      paddingVertical: verticalMarginScale(6),
      paddingHorizontal: horizontalMarginScale(12),
    },

    actionCtaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(8),
      marginHorizontal: horizontalMarginScale(20),
      paddingVertical: verticalMarginScale(8),
    },
    borderActionCta: {
      borderWidth: verticalScale(2),
      borderColor: COLORS.black,
    },
    actionCta: {
      width: undefined,
      flex: 1,
    },
  });
};

export default createStyles;

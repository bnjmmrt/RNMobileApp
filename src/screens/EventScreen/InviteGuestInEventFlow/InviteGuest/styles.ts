import { StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

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

    bannerTextContainer: {
      backgroundColor: COLORS.bgBlue,
      flexDirection: 'row',
      gap: horizontalMarginScale(8),
      paddingVertical: verticalMarginScale(8),
      paddingHorizontal: horizontalMarginScale(8),
      borderRadius: radiusScale(8),
    },
    bannerInfo: {
      height: verticalScale(16),
      width: verticalScale(16),
      tintColor: COLORS.blueDark,
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

    inputStyle: {
      height: null,
      paddingVertical: verticalScale(12),
    },

    userPreviewContainer: {
      borderColor: COLORS.borderGray,
      borderWidth: 1,
      borderRadius: radiusScale(16),
      backgroundColor: COLORS.lighter_gray,
      padding: horizontalMarginScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(9),
    },
    userName: {
      color: COLORS.black,
    },
    alreadyPresent: {
      fontSize: fontScale(12),
      color: COLORS.light_gray,
      marginTop: verticalMarginScale(4),
    },
  });
};

export default createStyles;

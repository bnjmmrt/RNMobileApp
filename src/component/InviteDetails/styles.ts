import { StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

const createStyles = () => {
  return StyleSheet.create({
    container: {
      borderWidth: verticalScale(1),
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
      paddingHorizontal: horizontalMarginScale(16),
      paddingVertical: verticalMarginScale(16),
    },
    title: {
      fontSize: fontScale(18),
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    inviteDetailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: verticalScale(1),
      borderBottomColor: COLORS.borderGray,
      paddingBottom: verticalMarginScale(12),
    },
    accordianArrowContainer: {
      height: verticalScale(32),
      width: verticalScale(32),
      borderRadius: radiusScale(32),
      backgroundColor: COLORS.lighter_gray,
      justifyContent: 'center',
      alignItems: 'center',
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
  });
};

export default createStyles;

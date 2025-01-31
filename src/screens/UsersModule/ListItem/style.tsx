import {StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {fontFamily} from '../../../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

const createStyle = () => {
  return StyleSheet.create({
    usersListRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalMarginScale(20),
      paddingHorizontal: horizontalMarginScale(16),
      borderColor: COLORS.borderGray,
      borderWidth: verticalScale(1),
      borderRadius: radiusScale(8),
      gap: horizontalMarginScale(4),
    },
    usersListName: {
      color: COLORS.black,
    },
    usersListUserCountWrapper: {
      paddingVertical: verticalMarginScale(2),
      paddingHorizontal: horizontalMarginScale(4),
      backgroundColor: COLORS.tabBorderColor,
      borderRadius: 99,
    },
    usersListUserCount: {
      fontSize: fontScale(11),
      color: COLORS.black,
      textAlign: 'center',
    },
  });
};

export default createStyle;

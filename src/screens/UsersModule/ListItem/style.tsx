import { StyleSheet } from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { COLORS } from '../../../utils/constants';

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
      flex: 1,
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

import {StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {fontFamily} from '../../../utils/functions';
import {fontScale, horizontalMarginScale} from 'src/utils/dimensions';

const UserListItemStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(12),
    },
    userInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(12),
    },
    username: {
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
  });
};

export default UserListItemStyle;

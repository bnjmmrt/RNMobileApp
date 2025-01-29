import {StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {fontFamily} from '../../../utils/functions';

const UserListItemStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    username: {
      fontSize: 14,
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
  });
};

export default UserListItemStyle;

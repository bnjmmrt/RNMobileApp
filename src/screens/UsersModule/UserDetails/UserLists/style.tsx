import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    usersListRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: COLORS.lighter_gray,
      borderRadius: 8,
      gap: 4,
    },
    usersListName: {
      color: COLORS.black,
    },
    usersListUserCountWrapper: {
      paddingVertical: 2,
      paddingHorizontal: 4,
      backgroundColor: COLORS.tabBorderColor,
      borderRadius: 99,
    },
    usersListUserCount: {
      fontSize: 11,
      color: COLORS.black,
      textAlign: 'center',
    },
  });
};

export default createStyle;

import {StyleSheet} from 'react-native';
import {verticalMarginScale} from 'src/utils/dimensions';
import {COLORS} from '../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    container: {
      marginHorizontal: 12,
      marginTop: 16,
      gap: 16,
      flex: 1,
    },
    usersListRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderColor: COLORS.borderGray,
      borderWidth: 1,
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

    seprator: {
      marginTop: verticalMarginScale(16),
    },
  });
};

export default createStyle;

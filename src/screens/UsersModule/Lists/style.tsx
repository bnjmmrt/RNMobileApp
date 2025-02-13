import {StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/constants';
import {verticalMarginScale} from 'src/utils/dimensions';

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
      height: 1,
      backgroundColor: COLORS.borderGray,
      width: '70%',
      alignSelf: 'center',
      marginTop: verticalMarginScale(16),
    },
  });
};

export default createStyle;

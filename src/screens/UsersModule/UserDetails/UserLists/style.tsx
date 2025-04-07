import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    usersListRowContainer: {
      backgroundColor: COLORS.lighter_gray,
      borderWidth: 0,
    },
  });
};

export default createStyle;

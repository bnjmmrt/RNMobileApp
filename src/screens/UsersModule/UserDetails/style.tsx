import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';

const userDetailsStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
  });
};

export default userDetailsStyle;

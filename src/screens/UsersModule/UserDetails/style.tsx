import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {verticalMarginScale} from 'src/utils/dimensions';

const userDetailsStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
  });
};

export default userDetailsStyle;

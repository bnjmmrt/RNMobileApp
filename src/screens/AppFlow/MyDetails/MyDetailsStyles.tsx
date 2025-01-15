import { StyleSheet } from 'react-native';
import { Wp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const MyDetailsStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
};

export default MyDetailsStyles;

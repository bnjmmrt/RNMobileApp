import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    inputLabel: {
      color: COLORS.black,
    },
    input: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 12,
      height: 160,
      marginTop: 4,
      padding: 12,
    },
  });
};

export default createStyle;

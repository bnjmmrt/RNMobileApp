import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';

const createStyle = () => {
  return StyleSheet.create({
    userIneterstsRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: COLORS.borderGray,
    },
    userIneterstsName: {
      color: COLORS.black,
    },
  });
};

export default createStyle;

import { StyleSheet } from 'react-native';
import { Wp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const BaseCityScreenStyles = () => {
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
    spacer: {
      flex: 1,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    searchImage: { marginRight: 6 },
    input: {
      width: '90%',
      fontSize: 16,
      color: COLORS.white,
    },
  });
};

export default BaseCityScreenStyles;

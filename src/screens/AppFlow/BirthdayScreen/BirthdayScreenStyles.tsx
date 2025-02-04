import {StyleSheet} from 'react-native';
import {Wp} from '../../../utils/dimensions';

import {COLORS} from '../../../utils/constants';

const GenderScreenStyles = () => {
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
    inputContainer: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    input: {
      width: '90%',
      fontSize: 16,
      color: COLORS.black,
    },
    calenderImage:{marginRight:6,width:16,height:16},
    iconContainer: {},
  });
};

export default GenderScreenStyles;

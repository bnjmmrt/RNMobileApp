import {Platform, StyleSheet} from 'react-native';
import {Wp, Hp} from '../../../../utils/dimensions';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';

const createStyle = () => {
  return StyleSheet.create({
    container: {
      marginHorizontal: Wp(5),
      padding: 16,
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 16,
    },
    title: {
      fontSize: 16,
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
    seprator: {
      backgroundColor: COLORS.borderGray,
      height: 1,
      marginTop: 18,
      marginBottom: 16,
      marginHorizontal: -Wp(4),
    },
  });
};

export default createStyle;

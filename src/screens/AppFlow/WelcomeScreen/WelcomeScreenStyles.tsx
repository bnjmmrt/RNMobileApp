import { StyleSheet } from 'react-native';
import { Wp, Hp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';

const WelcomeScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.black2,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    textContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: Wp(70),
    },
    imgCon: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.white,
      height: Hp(10),
      width: Hp(10),
      borderRadius: Hp(10) / 2,
    },
    imgStyle: {
      resizeMode: 'contain',
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
    },
    title: {
      fontSize: 32,
      fontFamily: fontFamily.RomieTrial_Bold,
      textAlign: 'center',
      color: COLORS.white,
    },

    subtitle: {
      color: COLORS.light_gray,
      fontSize: 13,
      fontFamily: fontFamily.ABCDiatype_Regular,
      marginVertical: Hp(1),
      textAlign: 'center',
    },

  });
};

export default WelcomeScreenStyles;

import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const ProfileScreenStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: COLORS.white,
    },
    contentContainer: {
      flex: 1,
    },
    btnStyle: {
      width: '85%',
      borderRadius: 100,
    },
    logoContainer: {
      alignItems: 'center',
      marginVertical: 10,
    },
    logoImgStyle: {
      width: 100,
      height: 50,
      resizeMode: 'center',
    },
    textBelowStyle: {
      color: COLORS.light_gray,
      fontSize: 14,
      textAlign: 'center',
      fontFamily: fontFamily.ABCDiatype_Regular,
      marginBottom: 100,
    },
  });
};

export default ProfileScreenStyle;

import {Dimensions, Platform, StyleSheet} from 'react-native';
import {Wp, Hp} from '../../../../utils/dimensions';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';

let screenWidth: number = Dimensions.get('window').width;
const socialPresenceCardWidth = screenWidth - (Wp(10) + 38);

const createStyle = () => {
  return StyleSheet.create({
    userName: {
      fontSize: 24,
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Bold,
      marginTop: 8,
      textAlign: 'center',
    },
    memberTypeWrapper: {
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 99,
      marginTop: -10,
      backgroundColor: COLORS.white,
    },
    memberType: {
      fontSize: 12,
      color: COLORS.black,
    },

    favButtonWrapper: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 22,
      borderBottomRightRadius: 22,
      backgroundColor: COLORS.lighter_gray,
      marginHorizontal: Wp(5),
      padding: 8,
      marginTop: 2,
    },
    favButton: {
      marginHorizontal: 8,
      width: '100%',
      borderRadius: 99,
      borderWidth: 1,
      borderColor: COLORS.borderGray,
    },
  });
};

export default createStyle;

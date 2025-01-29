import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';
import {Wp} from '../../../../utils/dimensions';
import {fontFamily} from '../../../../utils/functions';

let screenWidth: number = Dimensions.get('window').width;
const socialPresenceCardWidth = screenWidth - (Wp(10) + 38);

const createStyle = () => {
  return StyleSheet.create({
    container: {},
    sectionTitle: {
      fontSize: 12,
      color: COLORS.light_gray,
      fontFamily: fontFamily.ABCDiatype_Medium,
      marginTop: 24,
      marginBottom: 12,
    },
    infoRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 8,
    },
    infoRowIcon: {
      height: 16,
      width: 16,
      tintColor: COLORS.surfaceSecondary,
    },
    infoRowTitle: {
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },

    socialPresenceRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: COLORS.lighter_gray,
      borderRadius: 99,
      justifyContent: 'center',
      width: socialPresenceCardWidth / 2,
      gap: 4,
    },
    socialPresenceRowIcon: {
      height: 20,
      width: 20,
    },
    socialPresenceRowValue: {
      color: COLORS.black,
    },

    totalFollowingContainer: {
      flexDirection: 'row',
    },
    totalFollowing: {
      fontSize: 64,
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Medium,
      lineHeight: 72,
    },
    totalFollowingUnit: {
      fontSize: 32,
      height: 64,
      color: COLORS.black,
      fontFamily: fontFamily.RomieTrial_Bold,
    },
  });
};

export default createStyle;

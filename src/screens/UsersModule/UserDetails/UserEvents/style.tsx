import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';

let screenWidth: number = Dimensions.get('window').width;
const cardWidth = (screenWidth - (24 + 16)) / 2;

const createStyle = () => {
  return StyleSheet.create({
    userEventWrapper: {
      width: cardWidth,
    },
    userEventImage: {
      height: screenWidth / 1.7,
      width: cardWidth,
      borderRadius: 8,
    },
    userEventName: {
      fontSize: 16,
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
      marginTop: 12,
      marginBottom: 4,
    },
    userEventTime: {
      fontSize: 12,
      color: COLORS.light_gray,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
  });
};

export default createStyle;

import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

let screenWidth: number = Dimensions.get('window').width;
const cardWidth = (screenWidth - horizontalMarginScale(24 + 16)) / 2;

const createStyle = () => {
  return StyleSheet.create({
    userEventWrapper: {
      width: cardWidth,
    },
    userEventImage: {
      height: screenWidth / 1.7,
      width: cardWidth,
      borderRadius: radiusScale(8),
    },
    userEventName: {
      fontSize: fontScale(16),
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
      marginTop: verticalMarginScale(12),
      marginBottom: verticalMarginScale(4),
    },
    userEventTime: {
      fontSize: fontScale(12),
      color: COLORS.light_gray,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
  });
};

export default createStyle;

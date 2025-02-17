import {Dimensions, StyleSheet} from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {COLORS} from '../../../../utils/constants';
import {fontFamily} from '../../../../utils/functions';

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

    filterBarContainer: {
      paddingVertical: verticalMarginScale(8),
      paddingHorizontal: verticalMarginScale(16),
      borderRadius: radiusScale(8),
      borderWidth: verticalScale(1),
      borderColor: COLORS.borderGray,
      marginHorizontal: horizontalMarginScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterBarSelectedSatusChip: {
      paddingVertical: verticalMarginScale(4),
      paddingHorizontal: verticalMarginScale(8),
      borderRadius: radiusScale(99),
    },
    filterBarSelectedSatusChipText: {textTransform: 'capitalize'},
    filterBarRightIconWrapper: {
      backgroundColor: COLORS.tabBorderColor,
      padding: verticalMarginScale(8),
      borderRadius: radiusScale(99),
    },
    filterBarRightIconText: {
      color: COLORS.black,
    },
  });
};

export default createStyle;

import { StyleSheet } from 'react-native';
import { COLORS } from "src/utils/constants"
import { fontFamily } from "src/utils/functions"
import { horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';

const RecipientListItemStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: horizontalMarginScale(8),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.lighter_gray,
      marginTop: null,
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(10),
      borderRadius: radiusScale(8)
    },
    userInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalMarginScale(12),
    },
    username: {
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
  });
};

export default RecipientListItemStyle;

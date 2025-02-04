import { StyleSheet } from 'react-native';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale, Wp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const BaseCityScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius:radiusScale(100),
    },
    contentContainer: {
      flex: 1,
      paddingVertical:verticalMarginScale(10),
      paddingHorizontal:horizontalMarginScale(20),
    },
    spacer: {
      flex: 1,
    },
    inputContainer: {
      borderWidth:horizontalScale(1),
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      height: verticalScale(50),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal:horizontalMarginScale(15),
    },
    searchImage: { marginRight: 6 },
    input: {
      width: '90%',
      fontSize:fontScale(16),
      color: COLORS.white,
    },
  });
};

export default BaseCityScreenStyles;

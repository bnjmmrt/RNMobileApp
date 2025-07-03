import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  Wp,
} from '../../../utils/dimensions';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { fontFamily } from 'src/utils/functions';

const CreativeFocusScreenStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingBottom: 0,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: horizontalMarginScale(20),
      paddingVertical: verticalMarginScale(10),
    },
    categoryContainer: {
      marginTop: verticalMarginScale(10),
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingBottom: verticalMarginScale(100),
    },
    categoryButton: {
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: radiusScale(20),
      paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(15),
      margin: verticalMarginScale(2),
      backgroundColor: COLORS.lighter_gray,
    },
    selectedCategoryButton: {
      backgroundColor: COLORS.black,
      borderColor: COLORS.black,
    },
    categoryText: {
      fontSize: fontScale(14),
      color: COLORS.black,
    },
    selectedCategoryText: {
      color: COLORS.white,
    },
    categoryHeaderText: {
      fontSize: fontScale(16),
      fontWeight: '600',
      color: COLORS.black,
      paddingVertical: verticalMarginScale(12),
    },
    categoryHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: verticalMarginScale(12),
      paddingHorizontal: horizontalMarginScale(16),
      borderTopWidth: 1,
      borderTopColor: '#E1E1E1',
    },
    arrowIcon: {
      fontSize: fontScale(12),
      color: COLORS.black,
      fontWeight: 'bold',
    },
    arrowContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 30,
      height: 30,
      width: 30,
      borderRadius: radiusScale(15),
      backgroundColor: COLORS.lighter_gray,
    },
    collapsibleContainer: {
      marginVertical: verticalMarginScale(8),
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: radiusScale(100),
      bottom: BOTTOM_SAFEAREA_SPACING,
    },
    categoryHeaderCountContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    categoryHeaderCount: {
      width: 15,
      height: 15,
      borderRadius: radiusScale(10),
      backgroundColor: COLORS.neutral_surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryHeaderCountText: {
      fontSize: fontScale(10),
      color: COLORS.black,
      fontWeight: 'bold',
    },
    noResultsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalMarginScale(60),
      paddingHorizontal: horizontalMarginScale(40),
    },
    noResultsLogo: {
      width: Wp(40),
      height: verticalMarginScale(80),
      resizeMode: 'contain',
      marginBottom: verticalMarginScale(30),
    },
    noResultsTitle: {
      fontSize: fontScale(32),
      fontWeight: 'bold',
      fontFamily: fontFamily.RomieTrial_Bold,
      color: COLORS.black,
      textAlign: 'center',
      marginBottom: verticalMarginScale(12),
    },
    noResultsSubtitle: {
      fontSize: fontScale(16),
      color: COLORS.light_gray,
      textAlign: 'center',
      lineHeight: fontScale(22),
    },
    scrollView: {
      flex: 1,
      marginBottom: verticalMarginScale(100),
    },
  });

export default CreativeFocusScreenStyles;

import { StyleSheet } from 'react-native';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
  Hp,
} from 'src/utils/dimensions';

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    messageText: {
      color: COLORS.light_gray,
      textAlign: 'center',
      marginBottom: verticalMarginScale(16),
      marginHorizontal: horizontalMarginScale(20),
    },
    searchInputContainer: {
      marginHorizontal: horizontalMarginScale(20),
    },
    flatListContainer: {
      marginHorizontal: horizontalMarginScale(20),
      marginTop: verticalMarginScale(16),
    },
    flatListContentContainer: {
      gap: verticalMarginScale(16),
    },
    flatListFooter: {
      marginBottom: verticalMarginScale(150),
    },
    emptyContainer: {
      height: Hp(55),
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetFiltersButton: {
      alignSelf: 'center',
      width: undefined,
      height: undefined,
      paddingHorizontal: horizontalMarginScale(12),
      paddingVertical: verticalMarginScale(12),
      gap: horizontalMarginScale(6),
      marginTop: verticalMarginScale(30),
    },
    resetFiltersButtonImage: {
      height: verticalScale(16),
      width: verticalScale(16),
    },
    nextButton: {
      position: 'absolute',
      bottom: BOTTOM_SAFEAREA_SPACING,
    },
    skeletonListContainer: {
      marginTop: verticalMarginScale(16),
      marginHorizontal: horizontalMarginScale(20),
      flex: 1,
    },
    skeletonItemContainer: {
      marginBottom: verticalMarginScale(16),
    },
  });
};

export default createStyles;

import { Platform, Dimensions } from 'react-native';
import { horizontalMarginScale } from '../../../utils/dimensions';

export const isIPad = Platform.OS === 'ios' && Platform.isPad;
export const numColumns = isIPad ? 3 : 1;
export const screenWidth = Dimensions.get('window').width;
export const itemSpacing = horizontalMarginScale(15);
export const horizontalPadding = itemSpacing * 2;
export const columnWidth = isIPad
  ? (screenWidth - (horizontalPadding + itemSpacing * (numColumns - 1))) /
    numColumns
  : screenWidth - horizontalPadding;

export const gridStyles = {
  list: {
    flex: 1,
    paddingHorizontal: itemSpacing,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: itemSpacing,
  },
  itemContainer: {
    width: columnWidth,
  },
} as const;

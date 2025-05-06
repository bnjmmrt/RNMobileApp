import { Platform, Dimensions } from 'react-native';
import { horizontalMarginScale } from './dimensions';

const TABLET_WIDTH = 900;
export const isIPad = Dimensions.get('window').width >= TABLET_WIDTH;
export const numColumns = isIPad ? 3 : 1;
export const screenWidth = Dimensions.get('window').width;
export const itemSpacing = 16;
export const horizontalPadding = itemSpacing * 3;
export const columnWidth = isIPad
  ? (screenWidth - (horizontalPadding + itemSpacing * (numColumns - 1))) /
    numColumns
  : screenWidth - horizontalPadding;

export const gridStyles = {
  list: {
    flex: 1,
    paddingHorizontal: itemSpacing,
    paddingVertical: 0,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: itemSpacing,
  },
  itemContainer: {
    width: columnWidth,
  },
} as const;

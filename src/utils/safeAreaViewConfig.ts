import { SafeAreaViewConfig } from 'src/redux/slices/safeAreaViewConfigSlice';
import { COLORS } from './constants';

interface SafeAreaViewConfigInterface {
  [path: string]: SafeAreaViewConfig;
}

export const SAFEWAREAVIEW_CONFIG: SafeAreaViewConfigInterface = {
  DEFAULT_SCHEME: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: COLORS.white,
    showBottomSafeAreaView: true,
    bottomSafeAreaViewColor: COLORS.white,
    statusBarStyle: 'dark-content',
    translucent: false,
  },
  BLACK_SCHEME: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: COLORS.black2,
    showBottomSafeAreaView: true,
    bottomSafeAreaViewColor: COLORS.black2,
    statusBarStyle: 'default',
    translucent: false,
  },
};

import {SafeAreaViewConfig} from 'src/redux/slices/safeAreaViewConfigSlice';
import {COLORS} from './constants';

interface SafeAreaViewConfigInterface {
  [path: string]: SafeAreaViewConfig;
}

export const SAFEWAREAVIEW_CONFIG: SafeAreaViewConfigInterface = {
  EVENTS_TAB: {
    showTopSafeAreaView: false,
    topSafeAreaViewColor: COLORS.white,
    showBottomSafeAreaView: false,
    bottomSafeAreaViewColor: COLORS.white,
    statusBarStyle: 'dark-content',
    translucent: false,
  },
  USERS_TAB: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: COLORS.black,
    showBottomSafeAreaView: false,
    bottomSafeAreaViewColor: COLORS.white,
    statusBarStyle: 'default',
    translucent: false,
  },
};

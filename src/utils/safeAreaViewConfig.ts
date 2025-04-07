import { COLORS } from './constants';

export const SAFEWAREAVIEW_CONFIG = {
  DEFAULT_SCHEME: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: COLORS.white,
    showBottomSafeAreaView: true,
    bottomSafeAreaViewColor: COLORS.white,
    statusBarStyle: 'dark-content',
    translucent: false,
  },
  DEFAULT_TRANSLUCENT_SCHEME: {
    showTopSafeAreaView: false,
    topSafeAreaViewColor: 'transparent',
    showBottomSafeAreaView: false,
    bottomSafeAreaViewColor: 'transparent',
    statusBarStyle: 'dark-content',
    translucent: true,
  },
  BLACK_SCHEME: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: COLORS.black2,
    showBottomSafeAreaView: true,
    bottomSafeAreaViewColor: COLORS.black2,
    statusBarStyle: 'default',
    translucent: false,
  },
  STATIC_GRADIENT_SCHEME: {
    showTopSafeAreaView: true,
    topSafeAreaViewColor: '#121f22',
    showBottomSafeAreaView: true,
    bottomSafeAreaViewColor: '#151012',
    statusBarStyle: 'light-content',
    translucent: false,
  },
} as const;

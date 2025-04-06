/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { verticalMarginScale, verticalScale } from 'src/utils/dimensions';

const deviceHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar.currentHeight || 0;
const bottomNavBarHeight = deviceHeight - windowHeight - statusBarHeight;
const hasSoftNavButtons = bottomNavBarHeight > 0;

export const BOTTOM_SAFEAREA_SPACING =
  Platform.OS === 'android'
    ? hasSoftNavButtons
      ? verticalScale(10)
      : verticalScale(20)
    : verticalScale(30);

export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;
export const TOP_SAFEAREA_SPACING =
  Platform.OS === 'ios'
    ? STATUS_BAR_HEIGHT + verticalMarginScale(16)
    : (StatusBar.currentHeight || 0) + verticalMarginScale(16);

export const SafeAreaViewWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    bottomSafeAreaViewColor,
    showBottomSafeAreaView,
    showTopSafeAreaView,
    topSafeAreaViewColor,
  } = useSelector(
    (state: RootState) => ({
      showTopSafeAreaView: state.safeAreaView.showTopSafeAreaView,
      topSafeAreaViewColor: state.safeAreaView.topSafeAreaViewColor,
      showBottomSafeAreaView: state.safeAreaView.showBottomSafeAreaView,
      bottomSafeAreaViewColor: state.safeAreaView.bottomSafeAreaViewColor,
    }),
    shallowEqual,
  );

  return (
    <View style={{ flex: 1 }}>
      {showTopSafeAreaView ? (
        <SafeAreaView style={{ backgroundColor: topSafeAreaViewColor }} />
      ) : null}
      {children}
      {showBottomSafeAreaView ? (
        <SafeAreaView style={{ backgroundColor: bottomSafeAreaViewColor }} />
      ) : null}
    </View>
  );
};

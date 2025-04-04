/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { verticalMarginScale } from 'src/utils/dimensions';

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

  // const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;
  // const TOP_SPACING =
  //   Platform.OS === 'ios'
  //     ? STATUS_BAR_HEIGHT + verticalMarginScale(16)
  //     : (StatusBar.currentHeight || 0) + verticalMarginScale(16);

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

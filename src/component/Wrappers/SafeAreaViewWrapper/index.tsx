/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';

export const SafeAreaViewWrapper: React.FC<{children: React.ReactNode}> = ({
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
    <View style={{flex: 1}}>
      {showTopSafeAreaView ? (
        <SafeAreaView style={{backgroundColor: topSafeAreaViewColor}} />
      ) : null}
      {children}
      {showBottomSafeAreaView ? (
        <SafeAreaView style={{backgroundColor: bottomSafeAreaViewColor}} />
      ) : null}
    </View>
  );
};

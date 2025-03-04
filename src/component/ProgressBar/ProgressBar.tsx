import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';

const ProgressBar = () => {
  const progress = useSelector((state: RootState) => state.appFlow.pageProgress);
  const steps = 9; // Total number of steps
  const progressPercentage = (progress / steps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, {width: `${progressPercentage}%`}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '90%',
    height: 4,
    backgroundColor:COLORS.tabBorderColor,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.black,
    borderRadius: 10,
  },
});

export default ProgressBar;

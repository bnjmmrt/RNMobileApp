import IMAGES from '@images/index';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../utils/constants';
import {
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { CustomText } from '../CustomText';

interface CounterProps {
  onPressMinus: () => void;
  onPressPlus: () => void;
  counterValue: number;
}

const Counter: React.FC<CounterProps> = ({
  counterValue,
  onPressMinus,
  onPressPlus,
}) => {
  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        style={[styles.leftCounterButton, styles.counterButton]}
        onPress={onPressMinus}>
        <View style={styles.counterButtonIconWrapper}>
          <Image source={IMAGES.minus} />
        </View>
      </TouchableOpacity>
      <View style={styles.counterTextContainer}>
        <CustomText style={styles.counterText}>{counterValue}</CustomText>
      </View>
      <TouchableOpacity
        style={[styles.rightCounterButton, styles.counterButton]}
        onPress={onPressPlus}>
        <View style={styles.counterButtonIconWrapper}>
          <Image source={IMAGES.plus_black} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    height: verticalScale(16),
    minWidth: verticalScale(24),
    textAlign: 'center',
  },
  counterButtonIconWrapper: {
    height: verticalScale(16),
    width: horizontalScale(16),
  },
  counterButton: {
    height: verticalScale(40),
    width: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCounterButton: {
    backgroundColor: COLORS.tabBorderColor,
    borderTopLeftRadius: radiusScale(12),
    borderBottomLeftRadius: radiusScale(12),
    borderWidth: verticalScale(1),
    borderColor: COLORS.tabBorderColor,
  },
  counterTextContainer: {
    backgroundColor: COLORS.white,
    borderWidth: verticalScale(1),
    borderColor: COLORS.tabBorderColor,

    height: verticalScale(40),
    width: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightCounterButton: {
    backgroundColor: COLORS.tabBorderColor,
    borderTopRightRadius: radiusScale(12),
    borderBottomRightRadius: radiusScale(12),
    borderWidth: verticalScale(1),
    borderColor: COLORS.tabBorderColor,
  },
});

export default Counter;

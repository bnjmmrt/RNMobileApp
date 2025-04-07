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
  disabled: boolean;
}

const Counter: React.FC<CounterProps> = ({
  counterValue,
  onPressMinus,
  onPressPlus,
  disabled,
}) => {
  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        style={[
          styles.leftCounterButton,
          styles.counterButton,
          disabled && styles.disabledCounter,
        ]}
        onPress={onPressMinus}
        disabled={disabled}>
        <View style={styles.counterButtonIconWrapper}>
          <Image
            resizeMode='contain'
            source={IMAGES.minus}
            style={disabled && { tintColor: COLORS.neutral_disabled }}
          />
        </View>
      </TouchableOpacity>
      <View
        style={[
          styles.counterTextContainer,
          disabled && styles.disabledCounter,
        ]}>
        <CustomText
          style={[
            styles.counterText,
            disabled && { color: COLORS.neutral_disabled },
          ]}>
          {counterValue}
        </CustomText>
      </View>
      <TouchableOpacity
        style={[
          styles.rightCounterButton,
          styles.counterButton,
          disabled && styles.disabledCounter,
        ]}
        onPress={onPressPlus}
        disabled={disabled}>
        <View style={styles.counterButtonIconWrapper}>
          <Image
            resizeMode='contain'
            source={IMAGES.plus_black}
            style={disabled && { tintColor: COLORS.neutral_disabled }}
          />
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
    borderTopLeftRadius: radiusScale(8),
    borderBottomLeftRadius: radiusScale(8),
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
    borderTopRightRadius: radiusScale(8),
    borderBottomRightRadius: radiusScale(8),
    borderWidth: verticalScale(1),
    borderColor: COLORS.tabBorderColor,
  },
  disabledCounter: {
    backgroundColor: COLORS.bgGray,
  },
});

export default Counter;

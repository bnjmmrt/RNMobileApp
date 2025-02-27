import IMAGES from '@images/index';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS } from 'src/utils/constants';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface StatusButtonProps {
  text?: string;
  type: 'solid' | 'stripe' | 'circular';
  status?: 'approve' | 'reject';
  onPress?: () => void;
}

const StatusButton: React.FC<StatusButtonProps> = ({ text, type, status, onPress }) => {
  if (type === 'circular' && status) {
    const icon = status === 'approve' ? IMAGES.tick : IMAGES.cancel;
    const bgColor = status === 'approve' ? COLORS.successLight : COLORS.bgRed;
    const tintColor = status === 'approve' ? COLORS.success : COLORS.errorText;
    return (
      <TouchableOpacity style={[styles.circularButton, { backgroundColor: bgColor }]} onPress={onPress}>
        <Image source={icon} style={[styles.icon, { tintColor: tintColor }]} />
      </TouchableOpacity>
    );
  }

  const buttonStyle = type === 'solid' ? styles.solidButton : styles.stripeButton;
  const textStyle = type === 'solid' ? styles.solidText : styles.stripeText;

  return (
    <TouchableOpacity style={[styles.baseButton, buttonStyle]} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingHorizontal: horizontalMarginScale(16),
    flex: 1,
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(99),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(40)
  },
  solidButton: {
    backgroundColor: COLORS.black,
  },
  stripeButton: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  solidText: {
    color: COLORS.white,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium
  },
  stripeText: {
    color: COLORS.black,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium
  },
  circularButton: {
    width: radiusScale(48),
    height: radiusScale(48),
    borderRadius: radiusScale(99),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
});

export default StatusButton;

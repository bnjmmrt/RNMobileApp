import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../utils/constants';
import { verticalScale } from '../../utils/dimensions';

interface GradientSepratorProps {
  style?: ViewStyle;
}

const GradientSeprator: React.FC<GradientSepratorProps> = ({ style }) => {
  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.borderGray, COLORS.white]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(1),
    width: '100%',
    backgroundColor: COLORS.borderGray,
    alignSelf: 'center',
  },
});

export default GradientSeprator;

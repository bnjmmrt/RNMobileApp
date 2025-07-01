import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from 'src/utils/constants';
import HelpCircle from './SVG/HelpCircle';
import { CustomText } from './CustomText';

type Props = {
  children: React.ReactNode;
};

export default function AlertBadge({ children }: Props) {
  return (
    <View style={styles.container}>
      <HelpCircle />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: COLORS.bgYellow,
  },
});

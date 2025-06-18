import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from 'src/utils/constants';
import { CustomText } from './CustomText';
import RNFS from 'react-native-fs';

export default function FileDetails({
  title,
  type,
  size,
}: {
  title: string;
  type: string;
  size: string;
}) {
  const removeExtFromTitle = (title: string) => {
    const lastDotIndex = title.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return title.substring(0, lastDotIndex);
    }
    return title;
  };
  title = removeExtFromTitle(title);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{title}</CustomText>
      <CustomText style={styles.subtitle}>
        .{type} | {size || '0'}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    padding: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lighter_gray,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 500,
    color: '#BDBDBD',
    textTransform: 'uppercase',
  },
});

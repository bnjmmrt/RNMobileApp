import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from 'src/utils/constants';
import { fontScale } from 'src/utils/dimensions';
import IMAGES from '@images/index';

interface ProgressBannerProps {
  confirmed: number;
  total: number;
}

const ProgressBanner: React.FC<ProgressBannerProps> = ({
  confirmed,
  total,
}) => {
  const progress = (confirmed / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={IMAGES.confirmed_badge}
          style={[styles.confirmedBadge]}
        />
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {confirmed} <Text style={styles.totalText}>/ {total}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingTop: 8,
    right: 0,
    height: 80,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 9,
    elevation: 5,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmedBadge: {
    width: 22,
    height: 22,
  },
  progressContainer: {
    height: 4,
    flex: 1,
    backgroundColor: COLORS.lighter_gray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },

  progressText: {
    fontSize: fontScale(14),
    fontWeight: '500',
    color: COLORS.black,
  },
  totalText: {
    color: COLORS.light_gray,
    fontWeight: '500',
    fontSize: fontScale(14),
  },
});

export default ProgressBanner;

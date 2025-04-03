import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  verticalScale,
  fontScale,
} from '../utils/dimensions';

const EventItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          width={verticalScale(120)}
          height={horizontalScale(175)}
          borderRadius={8}
        />
      </SkeletonPlaceholder>
      <View style={styles.contentContainer}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width="80%"
              height={fontScale(24)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={fontScale(12)}
              marginTop={verticalMarginScale(10)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="50%"
              height={fontScale(12)}
              marginTop={verticalMarginScale(4)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="40%"
              height={fontScale(12)}
              marginTop={verticalMarginScale(4)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="30%"
              height={fontScale(36)}
              marginTop={verticalMarginScale(10)}
              borderRadius={100}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(16),
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: horizontalMarginScale(16),
  },
  contentContainer: {
    flex: 1,
    paddingTop: verticalMarginScale(18),
  },
});

export default EventItemSkeleton;

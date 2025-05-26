import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../utils/constants';

const EventItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
        <SkeletonPlaceholder.Item width={120} height={175} borderRadius={8} />
      </SkeletonPlaceholder>
      <View style={styles.contentContainer}>
        <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width="80%"
              height={24}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={12}
              marginTop={10}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="50%"
              height={12}
              marginTop={4}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="40%"
              height={12}
              marginTop={4}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              width="30%"
              height={36}
              marginTop={10}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 16,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 18,
  },
});

export default EventItemSkeleton;

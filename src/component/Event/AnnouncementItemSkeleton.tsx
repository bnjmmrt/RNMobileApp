import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
  fontScale,
  radiusScale,
} from 'src/utils/dimensions';

const AnnouncementItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
        <View style={styles.content}>
          {/* User Info */}
          <View style={styles.userInfoRow}>
            <SkeletonPlaceholder.Item
              width={36}
              height={36}
              borderRadius={18}
            />
            <View style={styles.userInfoContent}>
              <SkeletonPlaceholder.Item
                width={120}
                height={fontScale(16)}
                borderRadius={4}
                marginBottom={verticalMarginScale(4)}
              />
              <SkeletonPlaceholder.Item
                width={80}
                height={fontScale(12)}
                borderRadius={4}
              />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Announcement Text */}
          <View style={styles.textContainer}>
            <SkeletonPlaceholder.Item
              width="100%"
              height={fontScale(16)}
              borderRadius={4}
              marginBottom={verticalMarginScale(8)}
            />
            <SkeletonPlaceholder.Item
              width="90%"
              height={fontScale(16)}
              borderRadius={4}
              marginBottom={verticalMarginScale(8)}
            />
            <SkeletonPlaceholder.Item
              width="80%"
              height={fontScale(16)}
              borderRadius={4}
              marginBottom={verticalMarginScale(16)}
            />

            {/* Media Items */}
            <View style={styles.mediaContainer}>
              {[1, 2, 3].map((_, index) => (
                <SkeletonPlaceholder.Item
                  key={index}
                  width={80}
                  height={80}
                  borderRadius={8}
                  marginRight={10}
                />
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Recipients */}
          <View style={styles.recipientContainer}>
            <SkeletonPlaceholder.Item
              width={80}
              height={fontScale(14)}
              borderRadius={4}
              marginBottom={verticalMarginScale(8)}
            />
            <View style={styles.recipientTags}>
              {[1, 2, 3].map((_, index) => (
                <SkeletonPlaceholder.Item
                  key={index}
                  width={60}
                  height={30}
                  borderRadius={15}
                  marginRight={10}
                />
              ))}
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalMarginScale(16),
    borderRadius: radiusScale(8),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    overflow: 'hidden',
  },
  content: {
    padding: verticalMarginScale(16),
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContent: {
    marginLeft: horizontalMarginScale(12),
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderGray,
    marginVertical: verticalMarginScale(16),
  },
  textContainer: {
    marginBottom: verticalMarginScale(16),
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: verticalMarginScale(8),
  },
  recipientContainer: {
    marginTop: verticalMarginScale(8),
  },
  recipientTags: {
    flexDirection: 'row',
    marginTop: verticalMarginScale(8),
  },
});

export default AnnouncementItemSkeleton;

import IMAGES from '../../assets/images';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  radiusScale,
} from '../../utils/dimensions';

interface FeedFilterItemProps {
  content: string;
  handleClear: () => void;
}

const FeedFilterItem: React.FC<FeedFilterItemProps> = ({
  content,
  handleClear,
}) => {
  if (!content || content === ' - ') return null;

  return (
    <View style={styles.container}>
      <Text style={styles.content}>{content}</Text>
      <View onTouchEnd={handleClear} style={styles.closeContainer}>
        <Image source={IMAGES.filterClose} alt="close" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radiusScale(100),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    paddingLeft: horizontalMarginScale(16),
    paddingRight: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(8),
    backgroundColor: COLORS.whiteFeedContainer,
    marginHorizontal: horizontalMarginScale(8),
    height: horizontalScale(36),
  },
  content: {
    color: COLORS.black,
    lineHeight: 16,
  },
  closeContainer: {
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(8),
  },
});

export default FeedFilterItem;

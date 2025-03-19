import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { CustomText } from '../CustomText';

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
      <Text numberOfLines={1} style={styles.content}>{content}</Text>
      <TouchableOpacity hitSlop={2} onPress={handleClear} style={styles.closeContainer}>
        <Image
          source={IMAGES.filterClose}
          alt="close"
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(10),
    borderRadius: radiusScale(100),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.lighter_gray,
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    maxWidth: verticalScale(270)
  },
  content: {},
  closeContainer: {},
  icon: {
    width: 9,
    height: 9
  },
});

export default FeedFilterItem;

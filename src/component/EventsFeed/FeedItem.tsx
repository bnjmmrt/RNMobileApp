import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import IMAGES from '../../assets/images';
import type {EventItem} from './EventsFeed';
import FastImage from '@d11/react-native-fast-image';
import {
  horizontalMarginScale,
  verticalMarginScale,
  radiusScale,
  fontScale,
  Hp,
  Wp,
} from '../../utils/dimensions';

interface FeedItemProps {
  item: EventItem;
  isFeatured?: boolean;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
}

const FeedItem: React.FC<FeedItemProps> = ({item, setDetail}) => {
  return (
    <View style={styles.container} onTouchEnd={() => setDetail(item)}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={
            item.image ? {uri: item.image} : IMAGES.eventCoverPlaceholders1
          }
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={IMAGES.eventCoverPlaceholders1}
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.startDate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(11),
    width: Wp(48),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
  },
  icon: {
    height: Hp(33),
    width: Wp(41),
    borderRadius: radiusScale(10),
  },
  title: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: verticalMarginScale(1),
  },
});

export default FeedItem;

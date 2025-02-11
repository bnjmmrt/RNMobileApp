import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-animatable';
import {format} from 'date-fns';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import {
  Wp,
  Hp,
  verticalMarginScale,
  horizontalMarginScale,
  radiusScale,
  fontScale,
} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import type {EventItem, SeriesItem} from './EventsFeed';

interface FeedItemProps {
  item: EventItem;
  isFeatured?: boolean;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
}

const FeedItem: React.FC<FeedItemProps> = ({item, isFeatured, setDetail}) => {
  return (
    <View style={styles.container} onTouchEnd={() => setDetail(item)}>
      <View style={[styles.imageContainer]}>
        <Image
          source={
            item.image ? {uri: item.image} : IMAGES.eventCoverPlaceholders1
          }
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.startDate}
          {/* {item.startDate === 'Invalid Date'
            ? item.startDate
            : format(
                new Date(
                  `${item.startDate.slice(0, 10)}`,
                ),
                'MMM d, p',
              )} */}
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
    fontSize: fontScale(18),
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

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-animatable';
import {format} from 'date-fns';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import {Wp, Hp} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import {EventItem} from './EventsFeed';

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
          {item.startDate === 'Invalid Date'
            ? item.startDate
            : format(
                new Date(
                  `${item.startDate.slice(6, 10)}-${item.startDate.slice(
                    0,
                    2,
                  )}-${item.startDate.slice(3, 5)}`,
                ),
                'MMM d, p',
              )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    paddingHorizontal: 11,
    width: Wp(48),
    // height: Hp(25),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: 100,
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  icon: {
    // marginRight: 10,
    height: Hp(33),
    width: Wp(41),
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 12,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: 1,
  },
});

export default FeedItem;

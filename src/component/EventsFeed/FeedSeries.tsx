import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-animatable';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import {Wp, Hp} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import {SeriesItem} from './EventsFeed';

interface FeedSeriesProps {
  item: SeriesItem;
  setSeries: React.Dispatch<React.SetStateAction<SeriesItem | null>>;
}

const FeedSeries: React.FC<FeedSeriesProps> = ({item, setSeries}) => {
  console.log(item);
  return (
    <View style={styles.container} onTouchEnd={() => setSeries(item)}>
      <View style={[styles.imageContainer]}>
        <Image source={item.image} style={styles.image} />
        <Image
          source={
            item.events?.[0]?.image
              ? {uri: item.events[0].image}
              : IMAGES.eventCoverPlaceholders1
          }
          style={styles.image0}
        />
        <Image
          source={
            item.events?.[1]?.image
              ? {uri: item.events[1].image}
              : IMAGES.eventCoverPlaceholders1
          }
          style={styles.image1}
        />
        <Text style={styles.seriesLabel}>Series</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.period}
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
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  seriesLabel: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderRadius: 100,
    left: 12,
    top: 8,
    color: 'black',
    zIndex: 3,
  },
  image: {
    height: Hp(33),
    width: Wp(41),
    borderRadius: 10,
    zIndex: 3,
  },
  image0: {
    bottom: -3,
    position: 'absolute',
    height: Hp(33),
    width: Wp(37),
    borderRadius: 10,
    zIndex: 2,
  },
  image1: {
    bottom: -8,
    position: 'absolute',
    height: Hp(33),
    width: Wp(33),
    borderRadius: 10,
    zIndex: 1,
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

export default FeedSeries;

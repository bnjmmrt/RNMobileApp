import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import {
  Wp,
  Hp,
  verticalMarginScale,
  horizontalMarginScale,
  radiusScale,
  fontScale,
} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import type { SeriesItem } from './EventsFeed';
import FastImage from '@d11/react-native-fast-image';

interface FeedSeriesProps {
  item: SeriesItem;
  setSeries: React.Dispatch<React.SetStateAction<SeriesItem | null>>;
}

const FeedSeries: React.FC<FeedSeriesProps> = ({ item, setSeries }) => {
  console.log(item);
  return (
    <TouchableOpacity style={styles.container} onPress={() => setSeries(item)}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={item.image}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
        <FastImage
          source={{ uri: item?.events?[0]?.image }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image0}
        />
        <FastImage
          source={{ uri: item?.events?[1]?.image }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image1}
        />
        <View style={styles.seriesLabel}>
          <Text>Series</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.period}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: verticalMarginScale(20), // Provide enough space for stacked cards
  },
  image: {
    height: Hp(33),
    width: Wp(41),
    borderRadius: radiusScale(10),
    zIndex: 3,
    backgroundColor: COLORS.borderGray,
  },
  image0: {
    position: 'absolute',
    height: Hp(30),
    width: Wp(37),
    borderRadius: radiusScale(10),
    zIndex: 2,
    transform: [{ translateY: verticalMarginScale(8) }], // Slight shift
    backgroundColor: COLORS.borderGray,
  },
  image1: {
    position: 'absolute',
    height: Hp(27),
    width: Wp(33),
    borderRadius: radiusScale(10),
    zIndex: 1,
    transform: [{ translateY: verticalMarginScale(16) }], // Further shift
    backgroundColor: COLORS.borderGray,
  },

  container: {
    flexDirection: 'column',
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(11),
    width: Wp(48),
    // height: Hp(25),
  },
  // imageContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   position: 'relative',
  // },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
  },
  seriesLabel: {
    position: 'absolute',
    paddingHorizontal: horizontalMarginScale(12),
    paddingTop: verticalMarginScale(6),
    paddingBottom: verticalMarginScale(8),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(100),
    left: 12,
    top: 8,
    color: COLORS.black,
    zIndex: 3,
  },
  // image: {
  //   height: Hp(33),
  //   width: Wp(41),
  //   borderRadius: radiusScale(10),
  //   zIndex: 3,
  // },
  // image0: {
  //   bottom: -3,
  //   position: 'absolute',
  //   height: Hp(33),
  //   width: Wp(37),
  //   borderRadius: radiusScale(10),
  //   zIndex: 2,
  // },
  // image1: {
  //   bottom: -8,
  //   position: 'absolute',
  //   height: Hp(33),
  //   width: Wp(33),
  //   borderRadius: radiusScale(10),
  //   zIndex: 1,
  // },
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

export default FeedSeries;

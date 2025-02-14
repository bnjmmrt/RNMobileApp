import React from 'react';
import IMAGES from '../../assets/images';
import type { EventItem } from './EventsFeed';
import FastImage from '@d11/react-native-fast-image';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import {
  horizontalMarginScale,
  verticalMarginScale,
  radiusScale,
  fontScale,
  horizontalScale,
  verticalScale,
  Hp,
  Wp,
} from '../../utils/dimensions';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'src/navigation/Route';


interface FeedItemProps {
  item: EventItem;
  isFeatured?: boolean;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
}

const FeedItem: React.FC<FeedItemProps> = ({ item, isFeatured, setDetail }) => {
  const navigation = useNavigation();

  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item
    });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => handlEventPress()}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={{ uri: item.imageCover || item.imageFlyer }}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={IMAGES.eventCoverPlaceholders1}
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.startDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(10),
    width: Wp(50),
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
    borderRadius: 10,
    height: horizontalScale(245),
    width: verticalScale(166),
    backgroundColor: COLORS.borderGray
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

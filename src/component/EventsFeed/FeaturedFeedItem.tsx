import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ROUTES } from 'src/navigation/Route';
import { formatEventDate } from 'src/utils/dateFunctions';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { fontFamily, removeSignature } from '../../utils/functions';
import { CustomText } from '../CustomText';
import type { EventItem } from './EventsFeed';

interface FeedItemProps {
  item: EventItem;
  isFeatured?: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  const navigation = useNavigation();

  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handlEventPress()}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={{
            uri:
              removeSignature(item?.imageCover) ||
              removeSignature(item?.imageFlyer),
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <CustomText style={styles.title}>{item.name}</CustomText>
        <CustomText style={styles.subtitle}>
          {formatEventDate(item.startDate, item.endDate)}
        </CustomText>
        <CustomText style={styles.subtitle}>{item.location.city}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: verticalMarginScale(10),
    // paddingHorizontal: horizontalMarginScale(11),
    width: horizontalScale(237),
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
    height: verticalScale(317),
    width: horizontalScale(217),
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.borderGray,
  },
  title: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: verticalMarginScale(1),
  },
});

export default FeedItem;

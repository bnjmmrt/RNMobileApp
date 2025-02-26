import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ROUTES } from 'src/navigation/Route';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { CustomText } from '../CustomText';
import type { EventItem } from './EventsFeed';
import { formatEventDate } from 'src/utils/dateFunctions';

let screenWidth: number = Dimensions.get('window').width;

interface FeedItemProps {
  item: EventItem;
  from?: 'AllEvents' | 'UserDetail';
}

const FeedItem: React.FC<FeedItemProps> = ({ item, from = 'AllEvents' }) => {
  const navigation = useNavigation();

  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item,
    });
  };

  const getCardWidth = () => {
    switch (from) {
      case 'AllEvents':
        return (screenWidth - horizontalMarginScale(20) * 3) / 2;
      case 'UserDetail':
        return (screenWidth - horizontalMarginScale(40)) / 2;
    }
  };

  return (
    <TouchableOpacity
      style={{ width: getCardWidth() }}
      onPress={() => handlEventPress()}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={{ uri: item.imageCover || item.imageFlyer }}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={IMAGES.eventCoverPlaceholders1}
          style={styles.icon}
        />
      </View>
      {item.name || item.startDate ? (
        <View style={styles.contentContainer}>
          {item.name ? (
            <CustomText textProps={{ numberOfLines: 1 }} style={styles.title}>
              {item.name}
            </CustomText>
          ) : null}
          {item.startDate ? (
            <CustomText textProps={{ numberOfLines: 1 }} style={styles.subtitle}>
              {formatEventDate(item.startDate, item.endDate)}
            </CustomText>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: verticalMarginScale(12),
  },
  icon: {
    borderRadius: radiusScale(8),
    height: verticalScale(245),
    width: '100%',
    backgroundColor: COLORS.borderGray,
  },
  title: {
    fontSize: fontScale(16),
  },
  subtitle: {
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(4),
  },
});

export default FeedItem;

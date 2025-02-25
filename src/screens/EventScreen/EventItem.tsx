import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from 'src/component/CustomText';
import { ROUTES } from 'src/navigation/Route';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import ButtonSmall from '../../component/ButtonSmall';
import { BUTTON_LABLE, COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';

interface EventItemProps {
  item: {};
}
const EventItem: React.FC<EventItemProps> = ({ item }) => {
  // Handle the "Next" button press
  const navigation = useNavigation();
  // Handle the "Next" button press

  const dates = formatToDeviceTimeZone(item?.startDate, item?.endDate, false);

  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item,
    });
  };

  console.log('Sayyed event item :', item);
  return (
    <View style={styles.container}>
      <FastImage
        source={{ uri: item?.imageCover || item?.imageFlyer }}
        resizeMode={FastImage.resizeMode.cover}
        defaultSource={IMAGES.eventCoverPlaceholders1} // Your local placeholder image
        style={styles.icon}
      />

      <View style={styles.contentContainer}>
        <CustomText style={styles.titleStyle}>{item?.name}</CustomText>
        <CustomText style={styles.subtitle} textProps={{ numberOfLines: 2 }}>
          {`${dates[0]}, ${dates[1]}`}
        </CustomText>
        {item?.location?.city ? (
          <CustomText style={styles.subtitle} textProps={{ numberOfLines: 2 }}>
            {item?.location?.city}
          </CustomText>
        ) : null}

        <ButtonSmall
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.VIEW_EVENT}
          colorTheme={'dark'}
          onPress={handlEventPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    marginTop: verticalMarginScale(16),
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(12),
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(16),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    borderWidth: 1,
    marginBottom: 10,
    gap: horizontalMarginScale(16),
  },
  contentContainer: {
    flexDirection: 'column',
    paddingVertical: verticalMarginScale(18),
    flex: 1,
    backgroundColor: COLORS.white,
  },
  icon: {
    borderRadius: radiusScale(8),
    height: horizontalScale(175),
    width: verticalScale(120),
    backgroundColor: COLORS.borderGray,
  },
  titleStyle: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: verticalMarginScale(8),
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
  },
});

export default EventItem;

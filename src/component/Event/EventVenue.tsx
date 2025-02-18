import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from '../../utils/constants';
import IMAGES from '@images/index';
import { fontScale, Hp, verticalMarginScale, Wp } from 'src/utils/dimensions';
import ButtonSmall from '../ButtonSmall';
import MapView from 'react-native-maps';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import GradientSeprator from '../GradientSeprator';

interface EventVenueProps {
  item: {};
}

const handlEventPress = () => {
  // navigation.navigate('EventDetailsScreen', {item});
};

const EventVenue: React.FC<EventVenueProps> = ({ item }) => {
  const dates = formatToDeviceTimeZone(item?.startDate, item?.endDate);


  const latitude = item?.location?.latitude || 37.78825;
  const longitude = item?.location?.longitude || -122.4324;

  const openMap = () => {
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`, // Apple Maps
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`, // Google Maps
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        FlashMessageComponent.show('error', "Failed to open maps");
      });
    }
  };
  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1, padding: 5 }}>
        <View style={{ marginVertical: verticalMarginScale(10) }}>
          <Text style={styles.title}>{dates[0]}</Text>
          <Text style={styles.subtitle}>{dates[1]}</Text>
        </View>
        <GradientSeprator />
        <View style={{ marginVertical: verticalMarginScale(10) }}>
          <Text style={styles.title}>{"RSVP to See Location"}</Text>
          <Text style={styles.subtitle}>{item?.location?.city}</Text>
        </View>

        <View style={{ borderRadius: 10, overflow: 'hidden', height: 160, width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          />

          {item?.showLocation && <TouchableOpacity
            onPress={openMap}
            style={{
              width: 60,
              height: 60,
              backgroundColor: COLORS.black2,
              borderRadius: 30,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Image
              source={IMAGES.location}
              resizeMode='contain'
              tintColor={COLORS.white}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>}
        </View>


      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: COLORS.borderGray,
    flexDirection: 'column',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    resizeMode: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    paddingVertical: 5,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default EventVenue;

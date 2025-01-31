import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from '../../utils/constants';
import IMAGES from '@images/index';
import { Hp, Wp } from 'src/utils/dimensions';
import ButtonSmall from '../ButtonSmall';
import MapView from 'react-native-maps';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';

interface EventVenueProps {
  item: {};
}

const handlEventPress = () => {
  // navigation.navigate('EventDetailsScreen', {item});
};

const EventVenue: React.FC<EventVenueProps> = ({ item }) => {

  const latitude = 37.78825;
  const longitude = -122.4324;

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
        <Text style={styles.title}>{"Fri, April 13"}</Text>
        <Text style={styles.subtitle}>{"09:00 PM - 11:00 PM EST"}</Text>

        <View style={{ height: 1, width: '80%', backgroundColor: COLORS.borderGray, marginVertical: 10, alignSelf: 'center' }}></View>

        <Text style={styles.title}>{"RSVP to See Location"}</Text>
        <Text style={styles.subtitle}>{"Los Angeles, California"}</Text>

        <View style={{ borderRadius: 10, overflow: 'hidden', height: 160, width: '100%', alignSelf: 'center', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
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

          <TouchableOpacity
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
          </TouchableOpacity>
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
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 14,
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

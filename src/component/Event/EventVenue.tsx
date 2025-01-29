import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from '../../utils/constants';
import IMAGES from '@images/index';
import { Hp, Wp } from 'src/utils/dimensions';
import ButtonSmall from '../ButtonSmall';
import MapView from 'react-native-maps';

interface EventVenueProps {
  item: {};
}

const handlEventPress = () => {
  // navigation.navigate('EventDetailsScreen', {item});
};

const EventVenue: React.FC<EventVenueProps> = ({ item }) => {


  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1, padding: 5 }}>
        <Text style={styles.title}>{"Fri, April 13"}</Text>
        <Text style={styles.subtitle}>{"09:00 PM - 11:00 PM EST"}</Text>

        <View style={{ height: 1, width: '80%', backgroundColor: COLORS.borderGray, marginVertical: 10, alignSelf: 'center' }}></View>

        <Text style={styles.title}>{"RSVP to See Location"}</Text>
        <Text style={styles.subtitle}>{"Los Angeles, California"}</Text>

        <View style={{ borderRadius: 10, overflow: 'hidden', height: 200, width: '100%', alignSelf: 'center', marginTop: 10 }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          />
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

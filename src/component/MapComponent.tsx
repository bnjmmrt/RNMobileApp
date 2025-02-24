import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import { useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import { COLORS, ROLE } from '../utils/constants';
import IMAGES from '@images/index';
import { RootState } from 'src/redux/slices';
import { FlashMessageComponent } from './FlashMessageComponent/FlashMessageComponent';
import { verticalMarginScale } from 'src/utils/dimensions';

interface Location {
  location?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface EventItem {
  startDate?: string;
  endDate?: string;
  location?: Location;
  currentGuestStatus?: string;
  showLocation?: boolean;
}

interface MapComponentProps {
  item: EventItem;
}

const MapComponent: React.FC<MapComponentProps> = ({ item }) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const isShowLocation = role === ROLE.HOST || item?.currentGuestStatus === 'confirmed';

  const latitude = item?.location?.latitude ?? 37.78825;
  const longitude = item?.location?.longitude ?? -122.4324;

  const openMap = () => {
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => FlashMessageComponent.show('error', 'Failed to open maps'));
    }
  };


  return (

    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      />

      {isShowLocation && (
        <TouchableOpacity onPress={openMap} style={styles.mapButton}>
          <Image source={IMAGES.location} resizeMode="contain" style={styles.mapIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    height: 160,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapButton: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.black2,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mapIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
});

export default MapComponent;

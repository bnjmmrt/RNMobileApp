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
import { fontFamily } from '../../utils/functions';
import { COLORS, ROLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { fontScale, verticalMarginScale } from 'src/utils/dimensions';
import { RootState } from 'src/redux/slices';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import GradientSeprator from '../GradientSeprator';
import MapComponent from '../MapComponent';

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

interface EventVenueProps {
  item: EventItem;
  handleCalendarPress: () => void

}


const EventVenue: React.FC<EventVenueProps> = ({ item, handleCalendarPress }) => {
  const dates = formatToDeviceTimeZone(item?.startDate, item?.endDate);
  const role = useSelector((state: RootState) => state.auth.role);
  // const dates = useMemo(() => formatToDeviceTimeZone(item?.startDate, item?.endDate));

  const isShowLocation = role === ROLE.HOST || item?.currentGuestStatus === 'confirmed';
  const locationText = isShowLocation ? item?.location?.location : 'RSVP to See Location';

  const addEventToCalender = () => {
  }

  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1, padding: 5 }}>
        <View style={{ marginVertical: verticalMarginScale(10), flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.title}>{dates[0]}</Text>
            <Text style={styles.subtitle}>{dates[1]}</Text>
          </View>
          <TouchableOpacity onPress={handleCalendarPress}>
            <Image source={IMAGES.calendarCircle} />
          </TouchableOpacity>
        </View>
        <GradientSeprator />
        <View style={{ marginVertical: verticalMarginScale(10) }}>
          <Text style={styles.title}>{"RSVP to See Location"}</Text>
          <Text style={styles.subtitle}>{item?.location?.city}</Text>
        </View>
        {!isShowLocation && <TouchableOpacity onPress={addEventToCalender}>
          <Image source={IMAGES.calender_event} />
        </TouchableOpacity>}
      </View>
      <GradientSeprator />
      <View style={styles.locationContainer}>
        <Text style={styles.title}>{locationText}</Text>
        <Text style={styles.subtitle}>{item?.location?.city}</Text>
      </View>

      <MapComponent item={item} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    padding: 15,
    borderRadius: 15,
    borderColor: COLORS.borderGray,
  },
  contentContainer: {
    flex: 1,
    padding: 5,
    flexDirection: 'row'
  },
  dateContainer: {
    marginBottom: verticalMarginScale(10),
    flex: 1
  },
  locationContainer: {
    marginVertical: verticalMarginScale(10),
  },
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

export default EventVenue;

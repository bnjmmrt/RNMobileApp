import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import {
  fontFamily,
  getDisplayLocation,
  isCityInLocation,
  removeCityFromLocation,
} from '../../utils/functions';
import { COLORS, ROLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { RootState } from 'src/redux/slices';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import GradientSeprator from '../GradientSeprator';
import MapComponent from '../MapComponent';
import { Event } from 'src/types';
import { CustomText } from '../CustomText';
import { horizontalMarginScale } from 'src/utils/dimensions';

interface EventVenueProps {
  item: Event;
  handleCalendarPress: () => void;
}

const EventVenue: React.FC<EventVenueProps> = ({
  item,
  handleCalendarPress,
}) => {
  const dates = formatToDeviceTimeZone(
    item?.startDate,
    item?.endDate,
    item?.timeZone,
  );
  const role = useSelector((state: RootState) => state.auth.role);
  // const dates = useMemo(() => formatToDeviceTimeZone(item?.startDate, item?.endDate));

  const locationText = getDisplayLocation(
    item?.location?.location,
    item?.currentGuestStatus,
    item?.showLocation,
    role,
  );
  const isHideCity = isCityInLocation(locationText, item?.location?.city || '');

  // const result = removeCityFromLocation(locationText, item?.location?.city || '')
  return (
    <View style={[styles.container]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 16,
        }}>
        <View>
          <CustomText style={styles.title}>{dates[0]}</CustomText>
          <CustomText style={styles.subtitle}>{dates[1]}</CustomText>
        </View>
        {item?.currentGuestStatus === 'CONFIRMED' && (
          <TouchableOpacity onPress={handleCalendarPress}>
            <Image resizeMode="contain" source={IMAGES.calendarCircle} />
          </TouchableOpacity>
        )}
      </View>

      <GradientSeprator />

      {item?.furtherInstructions && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: horizontalMarginScale(16),
            }}>
            <View>
              <CustomText style={styles.title}>Further instructions</CustomText>
              <CustomText style={styles.subtitle}>
                {item?.furtherInstructions}
              </CustomText>
            </View>
          </View>

          <GradientSeprator />
        </>
      )}

      <View style={styles.locationContainer}>
        <CustomText style={styles.title}>{locationText}</CustomText>
        {!isHideCity && (
          <CustomText style={styles.subtitle}>
            {item?.location?.city}
          </CustomText>
        )}
      </View>

      <MapComponent item={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderColor: COLORS.borderGray,
    gap: 16,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
  },
  dateContainer: {
    marginBottom: 10,
    flex: 1,
  },
  locationContainer: {},
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
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    marginTop: 4,
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

import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from 'src/component/CustomText';
import { ROUTES } from 'src/navigation/Route';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import ButtonSmall from '../../component/ButtonSmall';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT,
  LABLE,
  ROLE,
} from '../../utils/constants';
import {
  fontFamily,
  getDisplayLocation,
  isCityInLocation,
  removeSignature,
} from '../../utils/functions';
import { formatDetailedEventDate } from 'src/utils/dateFunctions';
import { Event } from 'src/types';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

interface EventItemProps {
  item: Event;
}
const EventItem: React.FC<EventItemProps> = ({ item }) => {
  // Handle the "Next" button press
  const navigation = useNavigation();
  // Handle the "Next" button press
  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const dates = formatDetailedEventDate(
    item?.startDate,
    item?.endDate,
    item?.timeZone,
  );
  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item,
    });
  };

  const getUserRole = () => {
    if (!item || !userId) return '';

    // Check if the user is the owner
    if (item?.owner?.id === userId) {
      return 'HOST';
    }

    // Check if the user is in the collaborators list
    const collaborator = item.collaborators?.find(
      collab => collab?.id === userId,
    );

    if (collaborator) {
      return collaborator?.role?.name?.toUpperCase().replace('_', '-');
    }

    return ''; // Default return if no match is found
  };

  const locationText = getDisplayLocation(
    item?.location?.location,
    item?.guest?.guestStatus,
    item.showLocation,
    role,
  );
  const isHideCity = isCityInLocation(locationText, item?.location?.city || '');
  // const isShowLocation =
  //   role === ROLE.HOST ||
  //   item?.currentGuestStatus === 'CONFIRMED' ||
  //   item?.guest?.guestStatus === 'CONFIRMED';
  // const locationText = isShowLocation
  //   ? item?.location?.city
  //   : 'RSVP to See Location';

  return (
    <View style={styles.container}>
      <FastImage
        source={{
          uri:
            removeSignature(item?.imageCover) ||
            removeSignature(item?.imageFlyer),
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.icon}>
        {role === ROLE.HOST && (
          <View style={styles.roleContainer}>
            <CustomText style={styles.roleText}>{getUserRole()}</CustomText>
          </View>
        )}
      </FastImage>

      <View style={styles.contentContainer}>
        <CustomText style={styles.titleStyle} textProps={{ numberOfLines: 1 }}>
          {item?.name}
        </CustomText>
        <CustomText style={styles.subtitle} textProps={{ numberOfLines: 2 }}>
          {dates}{' '}
        </CustomText>
        {role === ROLE.HOST ? (
          <>
            <CustomText style={styles.subtitle}>
              {EVENT.TOTAL_CONFIRMED} {item?.totalConfirmedGuests}
            </CustomText>
            <CustomText style={styles.subtitle}>
              {EVENT.TOTAL_CHECKEDIN} {item?.totalCheckedInGuests}
            </CustomText>
          </>
        ) : (
          <View>
            <CustomText
              style={styles.subtitle}
              textProps={{ numberOfLines: 3 }}>
              {locationText}
            </CustomText>
            {!isHideCity && (
              <CustomText
                style={styles.subtitle}
                textProps={{ numberOfLines: 2 }}>
                {item?.location?.city}
              </CustomText>
            )}
          </View>
        )}
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
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },

  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 16,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingTop: 18,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  icon: {
    borderRadius: 8,
    height: 175,
    width: 120,
    backgroundColor: COLORS.borderGray,
  },
  titleStyle: {
    fontSize: 24,
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontSize: 12,
  },
  roleContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 3,
    borderColor: COLORS.black,
    paddingVertical: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 2,
    bottom: 1,
    marginBottom: 5,
    alignSelf: 'center',
  },
  roleText: {
    color: COLORS.black,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default EventItem;

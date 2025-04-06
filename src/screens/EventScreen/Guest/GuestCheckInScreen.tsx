import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  LABLE,
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  ROLE,
} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import ProfileCard from './ProfileCard';
import CheckInComponent from './CheckInComponent';
import EmptyRecordComponent from 'src/component/EmptyRecord/EmptyRecordComponent';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import AvatarInitials from 'src/component/AvatarInitials';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { ROUTES } from 'src/navigation/Route';

interface GuestCheckInScreenProps extends NativeStackScreenProps<any, any> {}

const GuestCheckInScreen: React.FC<GuestCheckInScreenProps> = ({
  navigation,
  route,
}) => {
  const { apiRequest, loading, error } = useApi();
  const [eventDetails, setEventDetails] = useState<any>({});
  const eventId = useSelector((state: RootState) => state.event.id);
  const getEventGuestDetails = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.event_guest_details + route?.params?.guestId,
    );
    if (response.success) {
      setEventDetails(response.data);
    }
  };
  useEffect(() => {
    getEventGuestDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );
  const handleBackPress = () => {
    // navigation.navigate(ROUTES.EventDetailsScreen, { eventId: eventId });
    navigation.goBack();
  };

  const handleProfilePress = () => {
    navigation.navigate(ROUTES.UserDetail, {
      user: eventDetails?.guestProfile.userId,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.CHECK_IN}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      {/* {true ? ( */}
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ProfileCard
            showGuestStatus={false}
            user={{
              name: eventDetails?.guestProfile?.name || '',
              avatar: eventDetails?.guestProfile?.profilePicture,
              roles: eventDetails?.guestProfile?.roles,
              age: eventDetails?.guestProfile?.age,
              followers: eventDetails?.guestProfile?.followsYou,
              location: eventDetails?.guestProfile?.location,
              status: eventDetails?.guestProfile?.status,
              interests: eventDetails?.guestProfile?.interest,
              isMember:
                eventDetails?.guestProfile?.roles[0].roleName === 'non_member'
                  ? false
                  : true,
            }}
            actionButtons={[
              {
                title: eventDetails?.guestProfile?.checkIn
                  ? LABLE.CHECKED_IN
                  : LABLE.CHECK_IN,
                icon: IMAGES.checkedinCurved,
                onPress: () => {},
                otherStyle: styles.checkInButton,
              },
              {
                title: LABLE.PROFILE,
                icon: IMAGES.arrow_up_right,
                onPress: handleProfilePress,
                otherStyle: styles.profileButton,
              },
            ]}
          />
          <View style={styles.card}>
            <AvatarInitials
              size={32}
              name={eventDetails?.guestProfile?.addedBy}
              imgUrl={eventDetails?.guestProfile?.addedByPicture}
            />
            <View style={{ paddingLeft: verticalMarginScale(8) }}>
              <Text style={styles.blurText}>Guest of</Text>
              <Text style={styles.username}>
                {eventDetails?.guestProfile?.addedBy}
              </Text>
            </View>
          </View>
          <CheckInComponent
            ticketType={eventDetails?.guestDetail?.ticketType}
            privateGuestNote={eventDetails?.guestDetail?.privateGuestNote}
            additionalGuests={eventDetails?.guestProfile?.additionalGuests}
            maxAdditionalGuests={eventDetails?.guestDetail?.maxAdditionalGuests}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {/* ) : (
        <EmptyRecordComponent
          title={LABLE.USER_NOT_FOUND}
          subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
          btnShown={true}
          btnIcon={IMAGES.searchWhite}
          btnLabel={LABLE.SEARCH_USERS}
        />
        // <EmptyRecordComponent
        //   title={LABLE.USER_ALREADY_CHECKED_IN}
        //   subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
        //   btnShown={true}
        //   btnIcon={IMAGES.profileWhite}
        //   btnLabel={LABLE.MANAGE_GUESTS}
        // />
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(14),
  },
  username: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  blurText: { color: COLORS.light_gray, fontSize: fontScale(11) },
  checkInButton: {
    flex: 0,
    backgroundColor: COLORS.bgGreen,
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    width: '70%',
  },
  profileButton: {
    flex: 0,
    width: '30%',
  },
});
export default GuestCheckInScreen;

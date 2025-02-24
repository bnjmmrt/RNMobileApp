import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { BUTTON_LABLE, COLORS, EVENT_STATUS, ROLE } from '../../utils/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FastImage from '@d11/react-native-fast-image';
import { fontFamily } from 'src/utils/functions';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import {
  fontScale,
  verticalMarginScale,
  verticalScale,
  Wp,
  Hp
} from 'src/utils/dimensions';
import BackButtonOverlay from 'src/component/BackButton/BackButtonOverlay';
import EventStatus from 'src/component/Event/EventStatus';
import EventHostItem from 'src/component/Event/EventHostItem';
import { FlatList } from 'react-native-gesture-handler';
import EventVenue from 'src/component/Event/EventVenue';
import EventOverview from 'src/component/Event/EventOverview';
import Button from 'src/component/Button';
import EventAnouncements from 'src/component/Event/EventAnnouncements';
import QRCodeBottomsheet from 'src/component/BottomSheet/QRCodeBottomsheet';
import CalenderEventsBottomSheet from 'src/component/BottomSheet/CalenderEventsBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useFetchEventDetailsQuery, useFetchHostEventDetailsQuery } from 'src/redux/actions/eventApiAction';
import IMAGES from '@images/index';
import EventTalent from 'src/component/Event/EventTalent';
import { ROUTES } from 'src/navigation/Route';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { useAcceptInvitationMutation } from 'src/redux/actions/rspvApiAction';
import EventRequests from 'src/component/Event/EventRequests';
import CircleButtonOverlay from 'src/component/BackButton/CircleButtonOverlay';
import { setSelectedEventForInvite } from 'src/redux/slices/inviteGuestsFlowSlice';

interface EventDetailsScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: any;
};

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RouteParams>>();
  const [isDeclinedByMe, setIsDeclinedByMe] = useState(false);
  const [isDeclinedByHost, setIsDeclinedByHost] = useState(false);
  const [guestStatus, setGuestStatus] = useState('NO_STATUS');
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);
  const [acceptInvite, { isLoading: acceptLoading }] = useAcceptInvitationMutation();
  const [collaborators, setCollaborators] = useState([]);
  const [talents, setTalents] = useState([]);



  const useFetchEventDetails = role === ROLE.HOST ? useFetchHostEventDetailsQuery : useFetchEventDetailsQuery;
  // Ensure argument structure remains consistent
  const queryArgs =
    role === ROLE.HOST
      ? ({ eventId: route?.params?.id } as const) // Type assertion to prevent union mismatch
      : ({
        userId,
        eventId: route?.params?.id,
      } as const); // Type assertion


  const { data, isLoading, refetch, isSuccess } = useFetchEventDetails(queryArgs, { refetchOnMountOrArgChange: true });


  // const { data, isLoading, refetch, isSuccess } = useFetchEventDetailsQuery(
  //   { eventId: route?.params?.id, userId: userId },
  //   { refetchOnMountOrArgChange: true },
  // );


  const qrCodeBottomSheetRef = useRef<any>(null);
  const calenderEventsBottomSheetRef = useRef<any>(null);

  const [isQRShown, setIsQRShown] = useState(true);
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (guestStatus === 'DECLINED') {
      setIsDeclinedByMe(data?.data?.invitationDeclinedBy == userId);
      setIsDeclinedByHost(data?.data?.invitationDeclinedBy !== userId);
    }
  }, [guestStatus]);

  useEffect(() => {
    // console.log('Event data:', data);
    if (data && data.data && data?.data?.collaborators) {
      setCollaborators(data.data.collaborators);
    }

    if (data && data.data && data?.data?.talents) {
      setTalents(data.data.talents);
    }

    setGuestStatus(data?.data?.currentGuestStatus);
  }, [data]);
  // console.log('Event details', route.params.id);
  const statusMap = [
    { id: '1', label: EVENT_STATUS.AWAITING },
    { id: '2', label: EVENT_STATUS.INVITED },
    { id: '3', label: EVENT_STATUS.DECLINED_BY_HOST },
    { id: '4', label: EVENT_STATUS.DECLINED_BY_YOU },
    { id: '5', label: EVENT_STATUS.GOING },
  ];
  const [images, setImages] = useState(statusMap);

  // const styles = EventDetailsScreenStyle();

  const onNextClick = () => {
    if (guestStatus === 'INVITED' || guestStatus === 'CONFIRMED') {
      navigation.navigate('RSVPInvitedUpcoming', { event: data.data });
    } else {
      navigation.navigate('RSVPNoStatusApplied', { event: data.data });
    }
  };

  const onDiscoverMoreClick = () => {
    navigation.goBack();
  };

  const onViewTicketClick = () => {
    qrCodeBottomSheetRef?.current.open();
    // FlashMessageComponent.show('success', "in Progress...")
  };
  const addCalenderEvents = () => {
    calenderEventsBottomSheetRef.current?.open();
  };

  const acceptInvitation = async () => {
    try {
      const accept_response = await acceptInvite({
        id: userId,
        eventId: route.params.id,
      });
      const updatedData = await refetch();
      if (updatedData?.data) {
        navigation.navigate('RSVPInvitedUpcoming', {
          event: updatedData?.data?.data,
        });
      } else {
        console.warn('Failed to get updated event data');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const onCheckInClick = async () => {
    navigation.navigate('GuestCheckInScreen');
  };

  const onPressInviteGuests = () => {
    dispatch(setSelectedEventForInvite(data.data));
    navigation.navigate(ROUTES.InviteGuestsScreen);
  };

  return (
    <View style={{ ...styles.container }}>
      <ScrollView>
        <View style={{ ...styles.contentContainer }}>
          <View>

            <FastImage
              source={{
                uri: route?.params?.imageCover || route?.params?.imageFlyer,
              }}
              resizeMode={FastImage.resizeMode.cover}
              defaultSource={IMAGES.eventCoverPlaceholders1} // Placeholder
              style={styles.icon}
            />

          </View>

          <Text style={styles.titleStyle}>{route?.params?.name}</Text>

          <EventStatus status={guestStatus} isDeclinedByMe={!isDeclinedByMe} />

          {role !== ROLE.NON_MEMBER && <FlatList
            data={collaborators}
            horizontal
            pagingEnabled={false}
            // style={{ marginVertical: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => <EventHostItem item={item} />}
          />}

          {role == ROLE.HOST && <EventRequests eventId={data?.data?.id} />}

          <EventVenue item={data?.data} handleCalendarPress={addCalenderEvents} />


          <EventOverview item={data?.data} />

          {talents.length > 0 && <EventTalent talents={talents} />}

          {/* {<EventAnouncements talents={talents} />} */}

          <Button
            disabled={false}
            style={styles.btnStyleLight}
            title="View Guest List"
            colorTheme="light"
            onPress={() =>
              navigation.navigate('EventGuestList', {
                guests: data?.data?.guests || [],
              })
            }
          />
        </View>
      </ScrollView>

      {!isDeclinedByHost && guestStatus !== 'CONFIRMED' && (
        <View style={{ margin: 20 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={
              guestStatus == 'APPLIED'
                ? BUTTON_LABLE.UPDATE_APPLICATION
                : BUTTON_LABLE.RSVP
            }
            colorTheme="dark"
            onPress={onNextClick}
          />
        </View>
      )}

      {guestStatus == 'DECLINED' && (
        <View style={{ margin: 20 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            loading={acceptLoading}
            title={BUTTON_LABLE.RSVP}
            colorTheme="dark"
            onPress={() => {
              onNextClick();
            }}
          />
        </View>
      )}

      {isDeclinedByMe && (
        <View style={{ margin: 20 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.DISCOVER_MORE_EVENTS}
            colorTheme="dark"
            onPress={onDiscoverMoreClick}
          />
        </View>
      )}

      <CalenderEventsBottomSheet
        ref={calenderEventsBottomSheetRef}
        eventDetails={{
          title: 'React Native Conference',
          startDate: new Date().toISOString(),
          endDate: new Date(
            new Date().getTime() + 2 * 60 * 60 * 1000,
          ).toISOString(), // 2 hours event
          location: 'San Francisco, CA',
          notes: 'A React Native meetup',
        }}
      />
      <QRCodeBottomsheet
        ref={qrCodeBottomSheetRef}
        title="Tao Desert Nights Desert Storm NYC House Party"
        subTitle={'September 8th, 3:00PM EST'}
        imageURL={isQRShown ? IMAGES.qr : IMAGES.ticket}
        isQRShown={isQRShown}
        name="ANURag harod"
      />

      {guestStatus == 'CONFIRMED' && (
        <View style={{ margin: 20 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.VIEW_TICKET}
            colorTheme="dark"
            onPress={onViewTicketClick}
          />
          <Button
            disabled={false}
            style={styles.btnStyleLight}
            title={BUTTON_LABLE.UPDATE_RSVP}
            colorTheme="light"
            onPress={onNextClick}
          />
        </View>
      )}

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CHECK_IN}
        colorTheme="dark"
        onPress={onCheckInClick}
      />

      <Button
        disabled={false}
        style={styles.btnStyleLight}
        title={BUTTON_LABLE.INVITE_GUESTS}
        colorTheme="light"
        onPress={onPressInviteGuests}
      />

      <BackButtonOverlay onPress={() => navigation.goBack()} />
      <BackButtonOverlay customStyle={{ right: 4 }} imageSource={IMAGES.edits} onPress={() => navigation.navigate(ROUTES.EditEventScreen, { event: data?.data })} />
      <BackButtonOverlay customStyle={{ right: 55 }} imageSource={IMAGES.share} onPress={() => navigation.goBack()} />

    </View>
  );
};

export default EventDetailsScreen;
const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    marginVertical: 10,
    height: 50,
  },

  btnStyleLight: {
    borderRadius: 100,
    marginVertical: 10,
    borderWidth: verticalScale(2),
    borderColor: COLORS.black,
    height: undefined,
    paddingVertical: verticalMarginScale(16),
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    alignItems: 'center',
    // height: 100,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: verticalScale(20),
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    backgroundColor: COLORS.borderGray,
    borderRadius: 20,
    height: verticalScale(528),
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  titleStyle: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    paddingHorizontal: 10,
  },
  subtitle: {
    color: COLORS.black2,
    fontSize: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

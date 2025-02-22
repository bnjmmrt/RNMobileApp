import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  ROLE,
} from '../../utils/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FastImage from '@d11/react-native-fast-image';
import { fontFamily } from 'src/utils/functions';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import {
  fontScale,
  verticalMarginScale,
  verticalScale,
  Wp,
  Hp,
} from 'src/utils/dimensions';
import BackButtonOverlay from 'src/component/BackButton/BackButtonOverlay';
import EventStatus from 'src/component/Event/EventStatus';
import EventHostItem from 'src/component/Event/EventHostItem';
import { FlatList } from 'react-native-gesture-handler';
import EventVenue from 'src/component/Event/EventVenue';
import EventOverview from 'src/component/Event/EventOverview';
import Button from 'src/component/Button';
// import { event_mock } from './eventMock';
import EventAnouncements from 'src/component/Event/EventAnnouncements';
import QRCodeBottomsheet from 'src/component/BottomSheet/QRCodeBottomsheet';
import CalenderEventsBottomSheet from 'src/component/BottomSheet/CalenderEventsBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useFetchEventDetailsQuery } from 'src/redux/actions/eventApiAction';
import IMAGES from '@images/index';
import EventTalent from 'src/component/Event/EventTalent';
import { ROUTES } from 'src/navigation/Route';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { useAcceptInvitationMutation } from 'src/redux/actions/rspvApiAction';
import { setSelectedEventForInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import moment from 'moment';

interface EventDetailsScreenProps extends NativeStackScreenProps<any, any> {}

type RouteParams = {
  params: any;
};

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RouteParams>>();
  const [isDeclinedByMe, setIsDeclinedByMe] = useState(false);
  const [isDeclinedByHost, setIsDeclinedByHost] = useState(false);
  const [guestStatus, setGuestStatus] = useState('NO_STATUS');
  const userId = useSelector((state: RootState) => state.auth.userId);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [
    acceptInvite,
    {
      isLoading: acceptLoading,
      isError: acceptError,
      isSuccess: acceptSuccess,
    },
  ] = useAcceptInvitationMutation();

  const [collaborators, setCollaborators] = useState([]);
  const [talents, setTalents] = useState([]);
  const qrCodeBottomSheetRef = useRef<any>(null);
  const calenderEventsBottomSheetRef = useRef<any>(null);
  const { data, isLoading, refetch, isSuccess } = useFetchEventDetailsQuery(
    { eventId: route?.params?.id },
    { refetchOnMountOrArgChange: true },
  );
  const [isQRShown, setIsQRShown] = useState(true);
  // const [qrURL, setQrURL] = useState('');
  const [eventDetails, setEventDetails] = useState<any>({});
  const [calendarDetails, setCalendarDetails] = useState<any>({});
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


  const parseDate = (dateStr:any) => {
    const [datePart, timePart] = dateStr.split(" ");
    return new Date(`${datePart}T${timePart}Z`).toISOString();
  };
  useEffect(() => {
    // console.log('Event data:', data);
    if(data?.data){
      setEventDetails({
        title: data.data.name,
        subTitle: data.data.startDate,
        name: data.data.owner.firstName + ' ' + data.data.owner.lastName,
      });
   

const startDate = moment.utc(data.data.startDate).toISOString();
const endDate = moment.utc(data.data.endDate).toISOString();
      setCalendarDetails({
        title: data.data.name,
        startDate: startDate,
        endDate: endDate, 
        location: data.data?.location.city,
        notes: data.data.description,
      });
    }
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

  const generateTicket = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.generate_ticket + data?.data?.guestId,
    );
    if (response.status === 200) {
      setEventDetails({...eventDetails,qrUrl:response.data.b64QRCode});
      qrCodeBottomSheetRef?.current.open();
    }
  };

  const onViewTicketClick = () => {
    //API call
    generateTicket();
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
    navigation.navigate(ROUTES.QRCodeScanner);
  };

  const onPressInviteGuests = () => {
    dispatch(setSelectedEventForInvite(data.data));
    navigation.navigate(ROUTES.InviteGuestsScreen);
  };

  return (
    <View style={{ ...styles.container }}>
      <ScrollView>
        <View style={{ ...styles.contentContainer }}>
          <View style={{}}>
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
          <FlatList
            data={collaborators}
            horizontal
            pagingEnabled={false}
            // style={{ marginVertical: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => <EventHostItem item={item} />}
          />
          <EventVenue
            item={data?.data}
            handleCalendarPress={addCalenderEvents}
          />
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
        eventDetails={calendarDetails}
      />
      <QRCodeBottomsheet
        ref={qrCodeBottomSheetRef}
        title={eventDetails?.title}
        subTitle={eventDetails?.subTitle}
        imageURL={eventDetails?.qrUrl ? eventDetails?.qrUrl : IMAGES.ticket}
        isQRShown={isQRShown}
        name={eventDetails?.name}
      />

      {guestStatus == 'CONFIRMED' && (
        <View style={{ margin: 20 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.VIEW_TICKET}
            colorTheme="dark"
            onPress={onViewTicketClick}
            loading={loading}
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
      {loginData?.roles[0]?.roleName === ROLE.HOST && (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.CHECK_IN}
          colorTheme="dark"
          onPress={onCheckInClick}
        />
      )}

      <Button
        disabled={false}
        style={styles.btnStyleLight}
        title={BUTTON_LABLE.INVITE_GUESTS}
        colorTheme="light"
        onPress={onPressInviteGuests}
      />

      <BackButtonOverlay onPress={() => navigation.goBack()} />
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

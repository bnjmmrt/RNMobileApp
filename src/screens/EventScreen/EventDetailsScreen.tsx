import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform } from 'react-native';
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
import QRCodeBottomsheet from 'src/component/BottomSheet/QRCodeBottomsheet';
import CalenderEventsBottomSheet from 'src/component/BottomSheet/CalenderEventsBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import {
  useFetchEventDetailsQuery,
  useFetchHostEventDetailsQuery,
  useFetchPublicEventDetailsQuery,
  useLazyFetchEventDetailsQuery,
  useLazyFetchPublicEventDetailsQuery,
} from 'src/redux/actions/eventApiAction';
import IMAGES from '@images/index';
import EventTalent from 'src/component/Event/EventTalent';
import { ROUTES } from 'src/navigation/Route';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { useAcceptInvitationMutation } from 'src/redux/actions/rspvApiAction';
import EventRequests from 'src/component/Event/EventRequests';
import CircleButtonOverlay from 'src/component/BackButton/CircleButtonOverlay';
import { setSelectedEventForInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import moment from 'moment';
import { setEventId } from 'src/redux/slices/eventSlice';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setRsvpStatus } from 'src/redux/slices/rspvSlice';

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
  const [isCurrentUserIsGuest, setIsCurrentGuestStatus] = useState(
    route?.params?.isCurrentUserIsGuest,
  );
  const rspvStatus = useSelector((state: RootState) => state.rspv.rspvStatus);

  const role = useSelector((state: RootState) => state.auth.role);
  // const insets = useSafeAreaInsets();

  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showTopSafeAreaView: false,
      });

      return () => {
        // Reset to default when screen is unfocused
        changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
      };
    }, []),
  );

  const [acceptInvite, { isLoading: acceptLoading }] =
    useAcceptInvitationMutation();
  const [collaborators, setCollaborators] = useState([]);
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    dispatch(setRsvpStatus(isCurrentUserIsGuest ? 'TRUE' : 'NO_STATUS'));
  }, [isCurrentUserIsGuest]);
  const queryArgs =
    role === ROLE.HOST
      ? ({ eventId: route?.params?.id } as const) // Type assertion to prevent union mismatch
      : ({
          userId,
          eventId: route?.params?.id,
        } as const); // Type assertion
  const useFetchEventDetailsHook =
    role === ROLE.HOST
      ? useFetchHostEventDetailsQuery
      : rspvStatus === 'NO_STATUS'
      ? useFetchPublicEventDetailsQuery
      : useFetchEventDetailsQuery;

  const { data, isLoading, refetch } = useFetchEventDetailsHook(queryArgs);

  useEffect(() => {
    console.log('RSVP Status:', rspvStatus);
    refetch(); // Manually refetch when RSVP status changes
  }, [rspvStatus, refetch]);

  // Ensure argument structure remains consistent

  // const { data, isLoading, refetch, isSuccess } = useFetchEventDetailsQuery(
  //   { eventId: route?.params?.id, userId: userId },
  //   { refetchOnMountOrArgChange: true },
  // );

  const qrCodeBottomSheetRef = useRef<any>(null);
  const calenderEventsBottomSheetRef = useRef<any>(null);

  const [isQRShown, setIsQRShown] = useState(true);
  // const [qrURL, setQrURL] = useState('');
  const [eventDetails, setEventDetails] = useState<any>({});
  const [calendarDetails, setCalendarDetails] = useState<any>({});

  const [useQr, setUseQr] = useState<boolean>(false);

  useEffect(() => {
    if (guestStatus === 'DECLINED') {
      setIsDeclinedByMe(data?.data?.invitationDeclinedBy == userId);
      setIsDeclinedByHost(data?.data?.invitationDeclinedBy !== userId);
    }
  }, [guestStatus]);

  const parseDate = (dateStr: any) => {
    const [datePart, timePart] = dateStr.split(' ');
    return new Date(`${datePart}T${timePart}Z`).toISOString();
  };
  useEffect(() => {
    //  console.log('Event data:', data);
    if (data?.data) {
      setUseQr(data.data.useQr);
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
      let collaborator = {
        ...data?.data?.owner,
        name: data?.data?.owner.companyName,
        role: {
          id: data?.data?.owner.id,
          name: 'host',
        }
      };

      // Merge the owner as a collaborator with existing collaborators
      setCollaborators([collaborator, ...data.data.collaborators]);
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
      if (response.data.eventQr) {
        setEventDetails({ ...eventDetails, qrUrl: response.data.b64QRCode });
        qrCodeBottomSheetRef?.current.open();
      } else {
        FlashMessageComponent.show('error', 'QR not genetaed');
      }
    }
  };

  const onViewTicketClick = () => {
    //API call
    if (useQr) {
      generateTicket();
    } else {
      setIsQRShown(false);
      qrCodeBottomSheetRef?.current.open();
    }
  };
  const addCalenderEvents = () => {
    calenderEventsBottomSheetRef.current?.open();
  };

  const acceptInvitation = async () => {
    try {
      const accept_response = await acceptInvite({
        id: userId,
        eventId: route?.params?.id,
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
    if (useQr) {
      dispatch(setEventId(route?.params?.id));
      navigation.navigate(ROUTES.QRCodeScanner);
    } else {
      navigateToViewList();
    }
  };

  const onPressInviteGuests = () => {
    dispatch(setSelectedEventForInvite(data.data));
    navigation.navigate(ROUTES.SelectGuestsToInviteScreen);
  };

  const navigateToViewList = () => {
    dispatch(setSelectedEventForInvite(data.data));
    navigation.navigate('EventGuestList', {
      eventId: route?.params?.id,
    });
  };

  const imageWrapperStyle = StyleSheet.create({
    wrapper: {
      height: verticalScale(528),
      borderRadius: 20,
      overflow: 'hidden' as const,
      marginTop: verticalScale(20) + STATUS_BAR_HEIGHT,
    },
  });
  const renderHostButtons = () => {
    if (role !== ROLE.HOST) {
      return null;
    }

    return (
      <>
        {/* <Button
          disabled={false}
          style={styles.btnStyleLight}
          title="View Guest List"
          colorTheme="light"
          onPress={navigateToViewList}
        /> */}
        <Button
          disabled={false}
          style={styles.btnStyleLight}
          title={BUTTON_LABLE.INVITE_GUESTS}
          colorTheme="light"
          onPress={onPressInviteGuests}
        />
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.CHECK_IN}
          colorTheme="dark"
          onPress={onCheckInClick}
        />
      </>
    );
  };
  const renderRSVPButton = () => {
    if (isDeclinedByHost || guestStatus === 'CONFIRMED' || role === ROLE.HOST) {
      return null;
    }

    return (
      <View>
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={
            guestStatus === 'APPLIED'
              ? BUTTON_LABLE.UPDATE_APPLICATION
              : BUTTON_LABLE.RSVP
          }
          colorTheme="dark"
          onPress={onNextClick}
        />
      </View>
    );
  };

  const renderConfirmedButtons = () => {
    if (guestStatus !== 'CONFIRMED' || role === ROLE.HOST) {
      return null;
    }

    return (
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
    );
  };

  return (
    <>
      {/* <SafeAreaView style={{ backgroundColor: COLORS.white }} /> */}
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.blurredBackgroundContainer}>
            <FastImage
              source={{
                uri: route?.params?.imageCover || route?.params?.imageFlyer,
              }}
              resizeMode={FastImage.resizeMode.cover}
              defaultSource={IMAGES.eventCoverPlaceholders1}
              style={styles.blurredBackground}
            />
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={128}
              reducedTransparencyFallbackColor="white"
            />
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={['rgba(255, 255, 255, 0)', '#FFFFFF']}
              locations={[0, 0.9]}
            />
          </View>

          {/* <SafeAreaView /> */}

          <View style={styles.contentContainer}>
            <View style={imageWrapperStyle.wrapper}>
              <FastImage
                source={{
                  uri: route?.params?.imageCover || route?.params?.imageFlyer,
                }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={IMAGES.eventCoverPlaceholders1}
                style={styles.mainImage}
              />
            </View>

            <Text style={styles.titleStyle}>{route?.params?.name}</Text>

            <EventStatus status={guestStatus} isDeclinedByMe={isDeclinedByMe} />

            {role !== ROLE.NON_MEMBER && (
              <FlatList
                data={collaborators}
                horizontal
                pagingEnabled={false}
                // style={{ marginVertical: 20 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <EventHostItem item={item} />}
              />
            )}

            {role == ROLE.HOST && <EventRequests eventId={data?.data?.id} />}

            <EventVenue
              item={data?.data}
              handleCalendarPress={addCalenderEvents}
            />

            <EventOverview item={data?.data} />

            {talents.length > 0 && <EventTalent talents={talents} />}

            {/* {<EventAnouncements talents={talents} />} */}
          </View>
          {/* {role === ROLE.HOST && <Button
            disabled={false}
            style={styles.btnStyleLight}
            title="View Guest List"
            colorTheme="light"
            onPress={navigateToViewList}
          />}

          {role === ROLE.HOST && <Button
            disabled={false}
            style={styles.btnStyleLight}
            title={BUTTON_LABLE.INVITE_GUESTS}
            colorTheme="light"
            onPress={onPressInviteGuests}
          />}

          {role === ROLE.HOST && (
            <Button
              disabled={false}
              style={styles.btnStyle}
              title={BUTTON_LABLE.CHECK_IN}
              colorTheme="dark"
              onPress={onCheckInClick}
            />
          )} */}
        </ScrollView>
        {renderHostButtons()}
        {renderRSVPButton()}
        {renderConfirmedButtons()}

        <CalenderEventsBottomSheet
          ref={calenderEventsBottomSheetRef}
          eventDetails={calendarDetails}
        />
        <QRCodeBottomsheet
          ref={qrCodeBottomSheetRef}
          title={eventDetails?.title}
          subTitle={eventDetails?.subTitle}
          imageURL={eventDetails?.qrUrl}
          isQRShown={isQRShown}
          name={eventDetails?.name}
        />

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

        <BackButtonOverlay
          customStyle={{ top: 16 + STATUS_BAR_HEIGHT }}
          onPress={() => navigation.goBack()}
        />

        {role === ROLE.HOST && (
          <BackButtonOverlay
            customStyle={{ right: 4, top: 16 + STATUS_BAR_HEIGHT }}
            imageSource={IMAGES.edits}
            onPress={() =>
              navigation.navigate(ROUTES.EditEventScreen, { event: data?.data })
            }
          />
        )}
        {role === ROLE.HOST && (
          <BackButtonOverlay
            customStyle={{ right: 55, top: 16 + STATUS_BAR_HEIGHT }}
            imageSource={IMAGES.share}
            onPress={() => navigation.goBack()}
          />
        )}
      </View>
    </>
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

    backgroundColor: 'transparent',
  },
  imageWrapper: {
    height: verticalScale(528),
    borderRadius: 20,
    overflow: 'hidden',
  },
  mainImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: verticalScale(20),
    flex: 1,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
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
  blurredBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(700),
    zIndex: -1,
    overflow: 'hidden',
  },
  blurredBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: verticalScale(300),
    objectFit: 'contain',
    transform: [{ scale: 1.5 }],
  },
});

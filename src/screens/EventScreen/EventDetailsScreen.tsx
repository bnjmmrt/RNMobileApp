/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { BlurView } from '@react-native-community/blur';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useDispatch, useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import BackButtonOverlay from 'src/component/BackButton/BackButtonOverlay';
import CalenderEventsBottomSheet from 'src/component/BottomSheet/CalenderEventsBottomSheet';
import QRCodeBottomsheet from 'src/component/BottomSheet/QRCodeBottomsheet';
import SignupFormsBottomSheet from 'src/component/BottomSheet/SignupFormsBottomSheet';
import Button from 'src/component/Button';
import EventAnnouncements from 'src/component/Event/EventAnnouncements';
import EventHostItem from 'src/component/Event/EventHostItem';
import EventInvitation from 'src/component/Event/EventInvitation';
import EventOverview from 'src/component/Event/EventOverview';
import EventRequests from 'src/component/Event/EventRequests';
import EventStatus from 'src/component/Event/EventStatus';
import EventTalent from 'src/component/Event/EventTalent';
import EventVenue from 'src/component/Event/EventVenue';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import ImageComponent from 'src/component/Image/ImageComponent';
import Toast from 'src/component/Toast/Toast';
import {
  BOTTOM_SAFEAREA_SPACING,
  TOP_SAFEAREA_SPACING,
} from 'src/component/Wrappers/SafeAreaViewWrapper';
import { ROUTES } from 'src/navigation/Route';
import {
  useFetchEventDetailsQuery,
  useFetchGuestStatusCountQuery,
  useFetchHostEventDetailsQuery,
  useFetchHostEventsAnnouncementQuery,
  useFetchSignupFormsQuery,
} from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { setEventId } from 'src/redux/slices/eventSlice';
import { setSelectedEventForInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
import { setRefresh, setRsvpStatus } from 'src/redux/slices/rspvSlice';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {
  changeSafeAreaViewConfig,
  fontFamily,
  removeSignature,
} from 'src/utils/functions';
import useCalender from 'src/utils/hooks/useCalender';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { BUTTON_LABLE, COLORS, LABLE, ROLE } from '../../utils/constants';

interface EventDetailsScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: any;
};

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  navigation,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { apiRequest, loading } = useApi();
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RouteParams>>();
  const [isDeclinedByMe, setIsDeclinedByMe] = useState(false);
  const [isDeclinedByHost, setIsDeclinedByHost] = useState(false);
  const [guestStatus, setGuestStatus] = useState('NO_STATUS');
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [isCurrentUserIsGuest] = useState(route?.params?.isCurrentUserIsGuest);
  const rspvStatus = useSelector((state: RootState) => state.rspv.rspvStatus);
  const refresh = useSelector((state: RootState) => state.rspv.refresh);
  const [showError, setshowError] = useState(false);
  const [loading1, setLoading] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const eventId = route?.params?.id;
  const { reset } = useNavigation();

  const { data: eventCount, refetch: refetchGuestStatusCount } =
    useFetchGuestStatusCountQuery({ eventId }, { skip: role !== ROLE.HOST });
  const annqueryArgs = {
    eventId: eventId,
    take: 50,
    skip: 0,
    id: userId,
    role: role,
  };
  const {
    data: announcementData,
    refetch: refetchAnnouncement,
    isLoading: announcementLoading,
  } = useFetchHostEventsAnnouncementQuery(annqueryArgs);

  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  const [collaborators, setCollaborators] = useState([]);
  const [talents, setTalents] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      refetchAnnouncement();
      setshowError(false);
    }, [announcementData]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (eventId && role == ROLE.HOST) {
        refetchGuestStatusCount();
      }
    }, [eventId]),
  );

  useEffect(() => {
    dispatch(setRsvpStatus(isCurrentUserIsGuest ? 'TRUE' : 'NO_STATUS'));
  }, [isCurrentUserIsGuest]);

  const queryArgs =
    role === ROLE.HOST
      ? ({ eventId: route?.params?.id } as const)
      : ({
        userId,
        eventId: route?.params?.id,
      } as const);

  const useFetchEventDetailsHook =
    role === ROLE.HOST
      ? useFetchHostEventDetailsQuery
      : useFetchEventDetailsQuery;
  const { data, isLoading, refetch } = useFetchEventDetailsHook(
    queryArgs as any, { skip: !userId },
  );

  useEffect(() => {
    refetch();
    dispatch(setRefresh(false));
  }, [rspvStatus, refetch, refresh]);

  const qrCodeBottomSheetRef = useRef<any>(null);
  const calenderEventsBottomSheetRef = useRef<any>(null);
  const profilePicture = useSelector((state: any) => state.auth.profilePicture);
  const [isQRShown, setIsQRShown] = useState(true);
  const [eventDetails, setEventDetails] = useState<any>({});
  const [calendarDetails, setCalendarDetails] = useState<any>({});
  const [showInviteGuestAlert, setShowInviteGuestAlert] =
    useState<boolean>(false);
  const [useQr, setUseQr] = useState<boolean>(false);

  useEffect(() => {
    if (guestStatus === 'DECLINED') {
      setIsDeclinedByMe(data?.data?.invitationDeclinedBy === userId);
      setIsDeclinedByHost(data?.data?.invitationDeclinedBy !== userId);
    }
  }, [guestStatus]);

  useEffect(() => {
    return () => {
      setShowInviteGuestAlert(false);
    };
  }, []);

  useEffect(() => {
    if (data?.data) {
      setUseQr(data.data.useQr);
      setEventDetails({
        title: data.data.name,
        subTitle: data.data.startDate,
        timeZone: data.data.timeZone,
        name: data.data.owner.firstName + ' ' + data.data.owner.lastName,
      });

      const startDate = moment.utc(data.data?.startDate).toISOString();
      const endDate = moment.utc(data.data?.endDate).toISOString();
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
        },
      };
      const approvedCollaborators = data.data.collaborators.filter(
        (col: any) => col.isApproved,
      );

      setCollaborators([collaborator, ...approvedCollaborators] as any);
    }

    if (data && data.data && data?.data?.talents) {
      setTalents(data.data.talents);
    }

    setGuestStatus(data?.data?.currentGuestStatus);
  }, [data]);

  const onNextClick = () => {
    if (guestStatus === 'INVITED' || guestStatus === 'CONFIRMED') {
      navigation.navigate('RSVPInvitedUpcoming', { event: data.data });
    } else {
      navigation.navigate('RSVPNoStatusApplied', { event: data.data });
    }
  };

  const generateTicket = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.generate_ticket + data?.data?.guestId,
    );
    if (response.success) {
      console.log('Sayed generate ticket:', response);
      setEventDetails({
        ...eventDetails,
        qrUrl: response.data.jwtToken,
        ticketType: response.data.ticketType || null,
        ticketDescription: response.data.ticketDescription || null,
      });
      qrCodeBottomSheetRef?.current.open();
      // if (response.data.eventQr) {
      // } else {
      //   FlashMessageComponent.show('error', 'QR not generated');
      // }
    }
  };

  const onViewTicketClick = () => {
    //API call
    if (useQr) {
      generateTicket();
    } else {
      generateTicket();
      setIsQRShown(false);
      qrCodeBottomSheetRef?.current.open();
    }
  };

  const { fetchCalendarEvent } = useCalender(calendarDetails || {});
  const addCalenderEvents = async () => {
    const existingEvents = await fetchCalendarEvent();
    const isEventExist =
      existingEvents?.find(event => event.title === calendarDetails.title) ||
      null;
    if (isEventExist) {
      const targetDate = new Date(calendarDetails.startDate); // Your desired date
      if (Platform.OS === 'ios') {
        let eventDateInMilisecond = Math.floor(targetDate / 1000);
        const seconds = eventDateInMilisecond - 978307200;
        Linking.openURL(`calshow:${seconds}`);
      } else if (Platform.OS === 'android') {
        Linking.openURL(
          `content://com.android.calendar/time/${targetDate.getTime()}`,
        );
      }
    } else {
      calenderEventsBottomSheetRef.current?.open();
    }
  };

  const addAnouncement = () => {
    const date1 = moment.utc(data?.data?.endDate);
    const date2 = moment();
    let eventData = data?.data;
    if (date1.isBefore(date2)) {
      FlashMessageComponent.show('error', LABLE.PAST_EVENT_ANNOUNCEMENTS_ERROR);
    } else {
      if (eventCount?.data?.confirmedCount === 0) {
        setshowError(true);
        setTimeout(() => {
          scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 1000);
      } else {
        navigation.navigate(ROUTES.EventStack, {
          screen: ROUTES.AddAnnouncementScreen,
          params: { eventData, announcementId: null },
        });
      }
    }
  };

  const onCheckInClick = async () => {
    setLoading(true);
    setTimeout(() => {
      if (useQr) {
        dispatch(setEventId(route?.params?.id));
        navigation.navigate(ROUTES.QRCodeScanner);
      } else {
        navigateToViewList();
      }
      setLoading(false);
    }, 500);
  };

  const onPressInviteGuests = () => {
    if (data && data.data) {
      if (data?.data?.status === 'PAST_STATUS') {
        setShowInviteGuestAlert(true);
      } else {
        dispatch(setSelectedEventForInvite(data.data));
        navigation.navigate(ROUTES.SelectGuestsToInviteScreen);
      }
    }
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
      marginTop: TOP_SAFEAREA_SPACING,
    },
  });
  const renderHostButtons = () => {
    if (role !== ROLE.HOST) {
      return null;
    }

    return (
      <>
        {showInviteGuestAlert ? (
          <Toast
            message={
              'You can no longer invite guests as the event date has passed. '
            }
            onClose={() => {
              setShowInviteGuestAlert(false);
            }}
            toastStyle={{
              position: 'relative',
              left: 0,
              right: 0,
              marginHorizontal: horizontalMarginScale(12),
              height: undefined,
              paddingVertical: verticalMarginScale(12),
              paddingHorizontal: verticalMarginScale(8),
              alignItems: 'flex-start',
            }}
          />
        ) : null}

        <Button
          disabled={false}
          style={[styles.btnStyle, { marginBottom: 15 }]}
          title={BUTTON_LABLE.CHECK_IN}
          colorTheme="dark"
          loading={loading1}
          onPress={onCheckInClick}
        />

        <Button
          disabled={false}
          style={[styles.btnStyle, { marginTop: 0 }]}
          title={BUTTON_LABLE.INVITE_GUESTS}
          colorTheme="light"
          buttonType="stripe"
          onPress={onPressInviteGuests}
        />
      </>
    );
  };
  const renderRSVPButton = () => {
    if (isDeclinedByHost || isDeclinedByMe || guestStatus === 'CONFIRMED' || role === ROLE.HOST) {
      return null;
    }

    if (data?.data?.status === 'PAST_STATUS') {
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

  const redirectToDiscover = () => {
    reset({
      index: 0,
      routes: [{ name: 'BottomTabBar' }],
    });
  }

  const renderDiscoverMoreEventButton = () => {
    if (isDeclinedByHost || isDeclinedByMe) {
      return <View style={{ margin: 10 }}>
        <Button
          disabled={false}
          style={[styles.btnStyle, { marginBottom: 15 }]}
          title={BUTTON_LABLE.DISCOVER_MORE_EVENTS}
          colorTheme="dark"
          onPress={redirectToDiscover}
          loading={loading}
        />
      </View>
    }
  }

  const renderConfirmedButtons = () => {

    if (guestStatus !== 'CONFIRMED' || role === ROLE.HOST) {
      return null;
    }
    const isPastEvent = data?.data?.status === 'PAST_STATUS';

    return (
      <View style={{ margin: 10 }}>
        <Button
          disabled={false}
          style={[styles.btnStyle, { marginBottom: 15 }]}
          title={BUTTON_LABLE.VIEW_TICKET}
          colorTheme="dark"
          onPress={onViewTicketClick}
          loading={loading}
        />
        {!isPastEvent ? (
          <Button
            disabled={false}
            style={styles.btnStyleLight}
            title={BUTTON_LABLE.UPDATE_RSVP}
            colorTheme="light"
            onPress={onNextClick}
          />
        ) : null}
      </View>
    );

  };

  const onPressManageInvite = () => {
    dispatch(setSelectedEventForInvite(data.data));
    navigation.navigate(ROUTES.EventGuestList, {
      eventId: route?.params?.id,
      isPastEvent: data?.data?.status === 'PAST_STATUS'
    });
  };

  const renderSkeleton = () => {
    return (
      <ScrollView
        style={{
          ...styles.container,
          marginTop: verticalScale(20) + STATUS_BAR_HEIGHT,
        }}>
        <View style={styles.contentContainer}>
          <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
            <SkeletonPlaceholder.Item>
              {/* Cover Image Skeleton */}
              <SkeletonPlaceholder.Item
                width="100%"
                height={verticalScale(528)}
                borderRadius={20}
              />

              {/* Title Skeleton */}
              <SkeletonPlaceholder.Item
                width="80%"
                height={40}
                marginTop={20}
                marginLeft={10}
              />

              {/* Event Status Skeleton */}
              <SkeletonPlaceholder.Item
                width={120}
                height={30}
                marginTop={20}
                marginLeft={10}
                borderRadius={15}
              />

              {/* Host Items Skeleton */}
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                marginTop={20}>
                {[1, 2].map((_, index) => (
                  <SkeletonPlaceholder.Item
                    key={index}
                    width={60}
                    height={60}
                    borderRadius={30}
                    marginLeft={index === 0 ? 10 : 5}
                  />
                ))}
              </SkeletonPlaceholder.Item>

              {/* Venue Section Skeleton */}
              <SkeletonPlaceholder.Item
                width="100%"
                height={120}
                marginTop={20}
                borderRadius={10}
              />

              {/* Overview Section Skeleton */}
              <SkeletonPlaceholder.Item
                width="100%"
                height={150}
                marginTop={20}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      </ScrollView>
    );
  };

  const signupFormsBottomSheetRef = useRef<any>(null);
  const { data: signupFormsData } = useFetchSignupFormsQuery(
    {
      eventId: route?.params?.id,
    },
    {
      skip: role !== ROLE.HOST,
    },
  );

  return (
    <>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <>
          {/* <SafeAreaView style={{ backgroundColor: COLORS.white }} /> */}
          <View style={styles.container}>
            <ScrollView ref={scrollViewRef} bounces={false}>
              <View style={styles.blurredBackgroundContainer}>
                <FastImage
                  source={{
                    uri: removeSignature(data?.data?.imageFlyer),
                  }}
                  resizeMode={FastImage.resizeMode.cover}
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
              {/* {Platform.OS === 'ios' && (
              )} */}

              {/* <SafeAreaView /> */}

              <View style={styles.contentContainer}>
                <View style={imageWrapperStyle.wrapper}>
                  <ImageComponent
                    loading={isLoading}
                    imageURL={
                      removeSignature(data?.data?.imageCover) ||
                      removeSignature(data?.data?.imageFlyer)
                    }
                  />
                </View>

                <Text style={styles.titleStyle}>{data?.data?.name}</Text>

                <EventStatus
                  status={guestStatus}
                  isDeclinedByMe={isDeclinedByMe}
                />

                <FlatList
                  data={collaborators}
                  horizontal
                  pagingEnabled={false}
                  // style={{ marginVertical: 20 }}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => (
                    <EventHostItem item={item} length={collaborators.length} />
                  )}
                />

                {(guestStatus == 'INVITED' || guestStatus == 'CONFIRMED') && (
                  <EventInvitation item={data?.data} />
                )}

                {role === ROLE.HOST && (
                  <EventRequests
                    eventId={data?.data?.id}
                    checkedinCount={data?.data?.totalCheckedInGuests}
                    onTicketBreakdownPress={onPressManageInvite}
                  />
                )}

                {!isLoading && (
                  <EventVenue
                    item={data?.data}
                    handleCalendarPress={addCalenderEvents}
                  />
                )}

                {(guestStatus === 'CONFIRMED' || role === ROLE.HOST) && (
                  <EventOverview
                    item={data?.data}
                    isFurtherInstrection={true}
                  />
                )}

                <EventOverview item={data?.data} isFurtherInstrection={false} />

                {talents.length > 0 && <EventTalent talents={talents} />}
                {announcementLoading && (
                  <ActivityIndicator color={COLORS.black} />
                )}
                {role == ROLE.HOST ? (
                  <EventAnnouncements
                    role={role}
                    handleAddPress={addAnouncement}
                    announcementData={announcementData}
                    eventId={eventId}
                    handleViewAll={() =>
                      navigation.navigate(ROUTES.EventStack, {
                        screen: ROUTES.Announcement,
                        params: data?.data,
                      })
                    }
                  />
                ) : (
                  <>
                    {guestStatus == 'CONFIRMED' && (
                      <EventAnnouncements
                        role={role}
                        handleAddPress={addAnouncement}
                        announcementData={announcementData}
                        eventId={eventId}
                        handleViewAll={() =>
                          navigation.navigate(ROUTES.EventStack, {
                            screen: ROUTES.Announcement,
                            params: data?.data,
                          })
                        }
                      />
                    )}
                  </>
                )}

                {showError && (
                  <View style={styles.errorTextContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setshowError(false);
                      }}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                          right: 5,
                          resizeMode: 'contain',
                        }}
                        source={IMAGES.x_circle}
                      />
                    </TouchableOpacity>
                    <Text style={styles.name}>
                      {LABLE.ADD_EVENT_ANNOUNCEMENTS_ERROR}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {renderHostButtons()}
            {renderRSVPButton()}
            {renderConfirmedButtons()}
            {renderDiscoverMoreEventButton()}

            <CalenderEventsBottomSheet
              ref={calenderEventsBottomSheetRef}
              eventDetails={calendarDetails}
            />
            <QRCodeBottomsheet
              ref={qrCodeBottomSheetRef}
              data={eventDetails}
              isQRShown={isQRShown}
              profilePic={profilePicture}
            />

            <SignupFormsBottomSheet
              ref={signupFormsBottomSheetRef}
              signupForms={signupFormsData?.data || []}
            />

            <BackButtonOverlay
              customStyle={{
                top: TOP_SAFEAREA_SPACING,
                marginTop: 0,
                marginHorizontal: 15,
              }}
              onPress={() => navigation.goBack()}
            />

            {role === ROLE.HOST && (
              <BackButtonOverlay
                customStyle={{
                  right: 0,
                  top: TOP_SAFEAREA_SPACING,
                  marginTop: 0,
                  marginHorizontal: 15,
                }}
                imageSource={IMAGES.edits}
                onPress={() =>
                  navigation.navigate(ROUTES.EditEventScreen, {
                    event: data?.data,
                  })
                }
              />
            )}
            {role === ROLE.HOST && signupFormsData?.data?.length > 0 && (
              <BackButtonOverlay
                customStyle={{
                  right: 55,
                  top: TOP_SAFEAREA_SPACING,
                  marginTop: 0,
                  marginHorizontal: 15,
                }}
                imageSource={IMAGES.share}
                onPress={() => signupFormsBottomSheetRef.current?.open()}
              />
            )}
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent',
  },

  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    gap: verticalScale(20),
    flex: 1,
    paddingBottom: verticalMarginScale(30),
  },
  btnStyle: {
    borderRadius: 100,
    marginTop: 10,
    marginBottom: BOTTOM_SAFEAREA_SPACING,
    height: 50,
  },
  btnStyleLight: {
    borderRadius: 100,
    marginTop: 0,
    marginBottom: BOTTOM_SAFEAREA_SPACING,
    borderWidth: verticalScale(2),
    borderColor: COLORS.black,
    height: undefined,
    paddingVertical: verticalMarginScale(16),
  },
  imageWrapper: {
    height: verticalScale(528),
    borderRadius: 20,
    overflow: 'hidden',
  },
  name: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  mainImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  titleStyle: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    paddingHorizontal: 5,
    color: 'black',
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
    backgroundColor: COLORS.borderGray,
  },
  errorTextContainer: {
    borderRadius: 10,
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EventDetailsScreen;

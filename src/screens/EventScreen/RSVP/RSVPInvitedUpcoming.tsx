import React, { useState } from 'react';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import useApi from 'src/axios/useApi';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import CustomSelectableText from 'src/component/CustomSelectableText/CustomSelectableText';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import Toast from 'src/component/Toast/Toast';
import {
  useAcceptInvitationMutation,
  useDeclineApplicationMutation,
  useDeleteConfirmedGuestMutation,
  useInviteGuestsMutation,
} from 'src/redux/actions/rspvApiAction';
import { RootState } from 'src/redux/slices';
import {
  deleteGuest,
  resetGuest,
  setResponse,
  setRsvpStatus,
  setSelectedGuest,
} from 'src/redux/slices/rspvSlice';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  LABLE,
  ROLE,
} from 'src/utils/constants';
import {
  fontScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import formatToDeviceTimeZone from 'src/utils/formatToDeviceTimeZone';
import {
  fontFamily,
  removeSignature,
  removeSpaceFromStr,
} from 'src/utils/functions';
import MessageBox from './BottomSheetView/MessageBox';
import SelectReason from './BottomSheetView/SelectReason';
import RenderCancelPopup from './RenderCancelPopup';
import { styles } from './styles';
import { SwipeableGuestList } from './SwipeableGuestList';
import {
  formatDetailedEventDate,
  formatEventRSVPDate,
} from 'src/utils/dateFunctions';
import { InteractionManager } from 'react-native';
import { Alert } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const reasons = [
  { id: 1, name: 'Scheduling Conflict' },
  { id: 2, name: 'Prior Commitment' },
  { id: 3, name: 'Traveling' },
  { id: 4, name: 'Event Location Inconvenient' },
  { id: 5, name: 'Not Interested in This Event' },
  { id: 6, name: 'Too Short of Notice' },
  { id: 7, name: 'Weather Concerns' },
  { id: 8, name: 'Other' },
];
type Guest = {
  id: number;
  name: string;
};
type Invitee = {
  guestStatus: string;
};

const calculateAvailableGuestPasses = (
  invitees: Invitee[],
  maxAdditionalGuest: number,
): number => {
  const confirmedGuests = invitees.filter(
    guest => guest.guestStatus !== 'DECLINED',
  ).length;
  const availableGuestPasses = Math.max(
    maxAdditionalGuest - confirmedGuests,
    0,
  );
  return availableGuestPasses;
};

export const EventCard = ({
  name,
  location,
  showLocation,
  imageCover,
  dates,
  currentGuestStatus,
}) => {
  const locationText =
    currentGuestStatus === 'CONFIRMED' && showLocation
      ? location?.location
      : location?.city;
  return (
    <View style={styles.card}>
      <FastImage
        source={{ uri: imageCover }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View style={styles.info}>
        <CustomText style={styles.title}>{name}</CustomText>
        <CustomText style={styles.details}>{dates}</CustomText>
        <CustomText style={styles.details}>{locationText}</CustomText>
      </View>
    </View>
  );
};
const StatusBanner = ({ isGoing, onPress }) => {
  return isGoing ? (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.statusBanner, { backgroundColor: COLORS.bgGreen }]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
        <Image resizeMode="contain" source={IMAGES.tickGoing} />
        <CustomText style={styles.statusText}> {'You are going'}</CustomText>
      </View>
      <Image
        source={IMAGES.downArrow}
        style={{ width: 10, height: 10, resizeMode: 'contain' }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.statusBanner}>
      <Image resizeMode="contain" source={IMAGES.tickInvited} />
      <CustomText style={styles.statusText}> {EVENT_STATUS.INVITED}</CustomText>
    </View>
  );
};
const optionList = [{ id: 1, label: 'Cancel RSVP' }];

const RSVPInvitedUpcoming = () => {
  const { params } = useRoute();
  const scrollRef = React.useRef(null);
  const {
    id,
    name,
    location,
    imageFlyer,
    startDate,
    endDate,
    timeZone,
    currentGuestStatus,
    showLocation,
  } = params.event;
  const [maxAdditionalGuests, setMaxAdditionalGuests] = React.useState(0);
  const status = params?.event?.currentGuestStatus;
  const { navigate, goBack, reset } = useNavigation();
  const [activeView, setActiveTab] = React.useState<string>('');
  const bottomSheetRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = React.useState<any>({});
  const [reasonSelected, setReasonSelected] = React.useState<any>('');
  const [showInfo, setShowInfo] = React.useState<boolean | null>(false);
  const [isToastShown, setIsToastShown] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [doResetStack, setDoResetStack] = useState<boolean>();

  const [
    declineApplication,
    { isLoading: declineLoading, isError: declineError },
  ] = useDeclineApplicationMutation();
  const [acceptInvite, { isLoading: acceptLoading, isError: acceptError }] =
    useAcceptInvitationMutation();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [invites, setInvites] = React.useState([]);
  const [inviteGuests, { isLoading: guestLoading, isError: addError }] =
    useInviteGuestsMutation();
  const [
    deleteConfirmedGuest,
    {
      isLoading: deleteGuestLoading,
      isError: deleteGuestError,
      isSuccess: deleteGuestSuccess,
    },
  ] = useDeleteConfirmedGuestMutation();
  const { apiRequest, loading, error } = useApi();
  const [selectedDeleteGuest, setSelectedDeleteGuest] = React.useState(null);
  const rspv = useSelector(state => state.rspv);
  console.log('siya rspv', rspv);
  React.useEffect(() => {
    getInvitees();
    return () => {
      handleResponse(null)
    }
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, [showInfo]);

  React.useEffect(() => {
    if (deleteGuestSuccess) {
      bottomSheetRef?.current?.close();
      getInvitees();
    }
  }, [deleteGuestError, deleteGuestSuccess]);

  const getInvitees = async () => {
    const response: any = await apiRequest(
      'get',
      `events/v1/users/${userId}/events/${id}/invited-guests`,
    );
    if (response.data) {
      setInvites(response.data[0].invitees);
      setMaxAdditionalGuests(response.data[0].maxAdditionalGuests);
    } else {
      setErrorMessage('Failed to fetch invitees');
    }
  };

  const handleResponse = response => {
    setIsToastShown(false);
    dispatch(setResponse(response));
  };
  const onAddGuest = async () => {
    if (
      calculateAvailableGuestPasses(combinedGuests, maxAdditionalGuests) === 0
    ) {
      scrollRef.current?.scrollToEnd({ animated: true });
      setIsToastShown(true);
    } else {
      navigate('AddGuestOptionScreen');
    }
  };
  const onClickReason = () => {
    setActiveTab('reasons');
    bottomSheetRef?.current?.open();
  };

  const onClickGuest = () => {
    setActiveTab('noofguests');
    bottomSheetRef?.current?.open();
  };

  const generateGuestList = (guestsCount: number): Guest[] => {
    const guestList: Guest[] = [{ id: 0, name: 'No Guests' }];

    for (let i = 1; i <= guestsCount; i++) {
      guestList.push({ id: i, name: `${i} Guest${i > 1 ? 's' : ''}` });
    }
    return guestList;
  };

  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'guests':
        return maxAdditionalGuests == 0
          ? '10%'
          : `${maxAdditionalGuests * 8 + 10}%`;
      case 'submit':
        return '60%';
      case 'options':
        return '12%';
      case 'cancel':
        return Platform.OS == 'android' ? '86%' : '80%';
      case 'leave':
        return '40%';
      case 'remove':
        return '40%';
      case 'reasons':
        return '60%';
      case 'noofguests':
        return maxAdditionalGuests == 0
          ? '10%'
          : `${maxAdditionalGuests * 8 + 10}%`;
      case 'success':
        return '42%';
      case 'failed':
        return '45%';
      default:
        return '85%';
    }
  };

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'leave':
        return renderLeaveWithoutSubmitting();
      case 'remove':
        return renderRemoveGuest();
      case 'options':
        return renderOptions();
      case 'cancel':
        return (
          <RenderCancelPopup
            id={id}
            onClose={() => {
              dispatch(setRsvpStatus('CANCELED'));
              bottomSheetRef?.current?.close();
              setTimeout(() => {
                goBack();
              }, 500);
            }}
            setReasonSelected={setReasonSelected}
            reasonSelected={reasonSelected}
          />
        );
      case 'reasons':
        return (
          <SelectReason
            list={reasons}
            handleSelect={item => {
              setSelectedReason(item);
              setErrorMessage('');
              bottomSheetRef?.current?.close();
            }}
          />
        );
      case 'noofguests':
        return (
          <BottomSheetScrollView style={{ flexGrow: 1 }}>
            <SelectReason
              list={generateGuestList(maxAdditionalGuests)}
              handleSelect={item => {
                dispatch(setSelectedGuest(item));
                bottomSheetRef?.current?.close();
              }}
            />
          </BottomSheetScrollView>
        );
      case 'failed':
        return (
          <MessageBox
            title={LABLE.WE_WERE_SORRY_CANT_MAKE_IT}
            subTitle={LABLE.RSVP_SUBTITLE}
            status={LABLE.YOU_DECLINED_THIS_INVITATION}
            btnLabel={LABLE.DISCOVER_MORE_EVENTS}
            onClose={() => {
              setDoResetStack(true);
              bottomSheetRef?.current?.close();
            }}
            btnStyle={[
              styles.clearButton,
              styles.btnBorder,
              { height: verticalScale(48) },
            ]}
          />
        );
      case 'success':
        return (
          <MessageBox
            title={LABLE.YOUR_RSPV_IS}
            subTitle={LABLE.YOU_CAN_RETURN_TO_THE}
            status={'You are going'}
            isSuccess={true}
            btnLabel={LABLE.DISCOVER_MORE_EVENTS}
            onClose={() => {
              setDoResetStack(true);
              bottomSheetRef?.current?.close();
            }}
            btnStyle={[
              styles.clearButton,
              styles.btnBorder,
              { height: verticalScale(48) },
            ]}
          />
        );

      default:
        return null;
    }
  };
  const renderLeaveWithoutSubmitting = () => (
    <View style={styles.leaveContainer}>
      <Title
        align="center"
        title="Leave without submitting?"
        subTitle="Are you sure you want to go back? Your changes will not be saved."
      />
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={'Leave'}
        colorTheme="dark"
        onPress={goBack}
      />
      <Button
        disabled={false}
        buttonType="stripe"
        style={[styles.btnStyle, { marginTop: '-5%' }]}
        onPress={() => {
          bottomSheetRef?.current?.close();
        }}
        title={'Cancel'}
        colorTheme="dark"
      />
    </View>
  );
  const renderRemoveGuest = () => (
    <View style={styles.leaveContainer}>
      <Title
        align="center"
        title="Remove Guest?"
        subTitle="Are you sure you want to remove this guest? They will be notified that their pass has been canceled. You can add a new guest later. "
      />
      <Button
        disabled={false}
        style={styles.btnStyle}
        loading={deleteGuestLoading}
        title={'Remove Guest'}
        colorTheme="dark"
        onPress={() => {
          handleRemoveGuest(userId, id, selectedDeleteGuest?.id);
        }}
      />
      <Button
        disabled={false}
        buttonType="stripe"
        style={[styles.btnStyle, { marginTop: '-5%' }]}
        onPress={() => {
          bottomSheetRef?.current?.close();
        }}
        title={'Cancel'}
        colorTheme="dark"
      />
    </View>
  );
  const handleRemoveGuest = async (userId, eventId, guestId) => {
    try {
      await deleteConfirmedGuest({ userId, eventId, id: guestId });
    } catch (error) {
      console.error('Failed to remove guest:', error);
    }
  };

  const renderOptions = () =>
    optionList.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.guestButton}
        onPress={() => {
          setActiveTab(item?.id === 1 ? 'cancel' : 'vouch');
          bottomSheetRef?.current?.open();
        }}>
        <Text style={styles.guestButtonText}>{item.label}</Text>
      </TouchableOpacity>
    ));
  const onSubmit = () => {
    if (rspv.response) {
      if (rspv?.response == 'No') {
        if (validateInputs()) {
          handleDecline();
        }
      } else {
        handleInviteGuests('add');
      }
    } else {
      setIsToastShown(true);
    }
  };
  const onUpdate = () => {
    if (rspv?.guests.length > 0) {
      handleInviteGuests('update');
    } else {
      goBack();
    }
  };
  const handleInviteGuests = async value => {
    try {
      if (value == 'add') {
        const accept_response = await acceptInvite({
          id: userId,
          eventId: id,
        });
        const response = await inviteGuests({
          userId: userId,
          eventId: id,
          guests: rspv?.guests,
        });
        console.log(accept_response);
        dispatch(resetGuest());
        setActiveTab('success');
        dispatch(setRsvpStatus('CONFIRMED'));
        bottomSheetRef?.current?.open();
      } else {
        const response = await inviteGuests({
          userId: userId,
          eventId: id,
          guests: rspv?.guests,
        });
        dispatch(resetGuest());
        dispatch(setRsvpStatus('CONFIRMED'));
        getInvitees();
        FlashMessageComponent.show('success', 'RSVP updated.');
      }
    } catch (error) {
      console.error('Failed to invite guests:', error);
    }
  };
  const validateInputs = () => {
    if (!selectedReason.name) {
      setErrorMessage('Please select a reason');
      return false;
    }
    setErrorMessage(null);
    return true;
  };
  const handleDecline = async () => {
    try {
      const response = await declineApplication({
        id: userId,
        eventId: id,
        reason: selectedReason.name,
        guestId: '',
      });
      dispatch(setRsvpStatus('DECLINED'));

      if (response?.data) {
        setActiveTab('failed');
        bottomSheetRef?.current?.open();
        console.log('Application declined successfully:', response.data);
      } else {
        console.warn('Failed to decline the application.');
      }
    } catch (error) {
      console.error('Error declining the application:', error);
    }
  };

  const renderInvitedRSVPView = () => {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingBottom: 24 }}>
            <EventCard
              name={name}
              location={location}
              showLocation={showLocation}
              imageCover={removeSignature(imageFlyer)}
              dates={formatDetailedEventDate(startDate, endDate, timeZone)}
            />
            <StatusBanner />
            <View style={[styles.card, { flexDirection: 'column' }]}>
              <View>
                <CustomText style={styles.info}>
                  Would you like to attend the event?
                </CustomText>
              </View>
              <View style={styles.rsvpButtonsRow}>
                <Button
                  disabled={false}
                  title={BUTTON_LABLE.YES}
                  onPress={() => handleResponse('Yes')}
                  style={
                    rspv.response == 'Yes'
                      ? styles.smallButton
                      : styles.clearButton
                  }
                  clearButtonStyle={
                    rspv.response == 'No'
                      ? styles.clearButton
                      : styles.smallButton
                  }
                  colorTheme={rspv.response == 'Yes' ? 'dark' : 'white'}
                />
                <Button
                  disabled={false}
                  title={BUTTON_LABLE.NO}
                  onPress={() => handleResponse('No')}
                  style={
                    rspv.response == 'No'
                      ? styles.smallButton
                      : styles.clearButton
                  }
                  clearButtonStyle={
                    rspv.response == 'Yes'
                      ? styles.clearButton
                      : styles.smallButton
                  }
                  colorTheme={rspv.response == 'No' ? 'dark' : 'white'}
                />
              </View>
            </View>
            {rspv.response == 'No' && (
              <View style={{ padding: verticalMarginScale(12) }}>
                <Text style={styles.label}>Why can’t you attend?</Text>
                <CustomSelectableText
                  placeholder={'Select...'}
                  rightImage={IMAGES.downArrow}
                  errorMessage={errorMessage}
                  defaultValue={selectedReason?.name}
                  onPress={onClickReason}
                  style={{
                    marginTop: verticalMarginScale(4),
                    // height: verticalScale(48),
                  }}
                />
                <Text style={styles.infoText}>{LABLE.RSVP_TEXT}</Text>
              </View>
            )}
            {rspv.response == 'Yes' && maxAdditionalGuests > 0 && (
              <>
                <View>
                  <Text style={[styles.infoText, { color: COLORS.black }]}>
                    The host is offering you the option to bring up to{' '}
                    {maxAdditionalGuests} guests. How many guests would you like
                    to bring?
                  </Text>
                  <CustomSelectableText
                    placeholder={'No Guest'}
                    rightImage={IMAGES.downArrow}
                    errorMessage={''}
                    defaultValue={rspv?.selectedGuest?.name}
                    onPress={onClickGuest}
                    style={styles.customSelectText}
                  />
                </View>
                {rspv?.selectedGuest?.name != rspv?.guests[0]?.name && (
                  <>
                    <View style={{ gap: 6 }}>
                      {rspv.guests.map(guest => {
                        return (
                          <GestureHandlerRootView>
                            <SwipeableGuestList
                              key={guest.id}
                              guest={guest}
                              onDelete={() =>
                                dispatch(
                                  deleteGuest({
                                    phoneNumber: removeSpaceFromStr(
                                      guest.phoneNumber,
                                    ),
                                    email: guest.email,
                                  }),
                                )
                              }
                            />
                          </GestureHandlerRootView>
                        );
                      })}
                    </View>
                    {rspv?.selectedGuest?.id > rspv?.guests?.length && (
                      <Button
                        disabled={false}
                        style={[
                          styles.clearButton,
                          styles.btnBorder,
                          { height: verticalScale(48) },
                        ]}
                        title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                        colorTheme="white"
                        onPress={onAddGuest}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
        {isToastShown && (
          <View style={styles.toastWrapper}>
            <Toast
              message={'Please select at least one'}
              onClose={() => setIsToastShown(false)}
            />
          </View>
        )}
        {rspv.response == 'Yes' && (
          <CustomText
            style={{
              color: COLORS.light_gray,
              textAlign: 'center',
              paddingTop: 12,
              paddingBottom: 8,
              fontSize: fontScale(14),
            }}>
            {`Please add your additional guests’ details by ${formatEventRSVPDate(
              startDate,
              timeZone,
            )}, or their passes will be canceled.`}
          </CustomText>
        )}

        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.SUBMIT}
          colorTheme="dark"
          loading={guestLoading}
          onPress={onSubmit}
        />
      </>
    );
  };
  const combinedGuests = [
    ...rspv.guests.map(guest => ({ ...guest, type: 'rspv' })),
    ...invites.map(guest => ({ ...guest, type: 'invite' })),
  ];

  const renderItem = ({ item }) => (
    <SwipeableGuestList
      key={item.id}
      guest={item}
      onDelete={value => {
        console.log(item);
        if (value.type === 'local') {
          dispatch(
            deleteGuest({
              phoneNumber: removeSpaceFromStr(item.phoneNumber),
              email: item.email,
            }),
          );
        } else {
          setSelectedDeleteGuest(item);
          setActiveTab('remove');
          bottomSheetRef.current.open();
        }
      }}
      onInfoClick={() => {
        setShowInfo(!showInfo);
      }}
    />
  );
  const renderUpcomingRSVPView = () => {
    let guestCount = calculateAvailableGuestPasses(
      combinedGuests,
      maxAdditionalGuests,
    )
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View style={{ flex: 1, paddingBottom: 24 }}>
            <EventCard
              name={name}
              location={location}
              showLocation={showLocation}
              imageCover={removeSignature(imageFlyer)}
              dates={formatDetailedEventDate(startDate, endDate, timeZone)}
              currentGuestStatus={currentGuestStatus}
            />
            <StatusBanner
              isGoing={true}
              onPress={() => {
                setActiveTab('options');
                bottomSheetRef?.current.open();
              }}
            />
            <View style={{ gap: 6 }}>
              {guestCount > 0 ?
                <CustomText style={{ color: COLORS.light_gray }}>
                  You have{' '}
                  {guestCount}{' '}
                  guest {guestCount > 1 ? 'passes' : 'pass'} available{' '}
                </CustomText> :
                <CustomText style={{ color: COLORS.light_gray }}>
                  You don't have any guest pass.
                </CustomText>}
              <FlatList
                data={combinedGuests}
                renderItem={renderItem}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
              />
              {showInfo && (
                <>
                  <CustomText
                    style={{
                      color: COLORS.black,
                      marginTop: 12,
                      marginLeft: 8,
                      fontFamily: fontFamily.ABCDiatype_Medium,
                      fontSize: fontScale(14),
                    }}>
                    This guest cannot be added as they may already have a status
                    on the guest list for this event. Contact the host if you
                    have any questions.
                  </CustomText>
                </>
              )}
              <Button
                disabled={false}
                style={[
                  styles.clearButton,
                  styles.btnBorder,
                  { height: verticalScale(48) },
                ]}
                title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                colorTheme="white"
                onPress={onAddGuest}
              />
              {isToastShown &&
                calculateAvailableGuestPasses(
                  combinedGuests,
                  maxAdditionalGuests,
                ) === 0 && (
                  <View style={styles.toastNoGuest}>
                    <TouchableOpacity onPress={() => setIsToastShown(false)}>
                      <Image resizeMode="contain" source={IMAGES.close} />
                    </TouchableOpacity>
                    <CustomText
                      style={{ color: COLORS.black, fontSize: fontScale(14) }}>
                      No guest passes remaining.
                    </CustomText>
                  </View>
                )}
            </View>
          </View>
        </ScrollView>

        <CustomText
          style={{
            color: COLORS.light_gray,
            textAlign: 'center',
            paddingTop: 12,
            paddingBottom: 8,
          }}>
          {`Please add your additional guests’ details by ${formatEventRSVPDate(
            startDate,
            timeZone,
          )}, or their passes will be canceled.`}
        </CustomText>
        <Button
          disabled={false}
          loading={guestLoading}
          style={styles.btnStyle}
          title={'Update RSVP'}
          colorTheme="dark"
          onPress={onUpdate}
        />
      </>
    );
  };
  const handleBackPress = () => {
    if (rspv?.guests?.length > 0) {
      setActiveTab('leave');
      bottomSheetRef.current?.open();
    } else {
      goBack();
    }
  };
  return (
    <View style={styles.container}>
      <Header
        headerTitle={BUTTON_LABLE.RSVP}
        showProgressBar={false}
        onPress={handleBackPress}
      />
      <View style={{ paddingHorizontal: 12, flex: 1 }}>
        {status === 'INVITED' && renderInvitedRSVPView()}
        {status === 'CONFIRMED' && renderUpcomingRSVPView()}
        <BottomSheetComponent
          ref={bottomSheetRef}
          onClose={() => {
            if (doResetStack) {
              // bottomSheetRef?.current?.close();
              reset({
                index: 0,
                routes: [{ name: 'BottomTabBar' }],
              });
            } else {
              (activeView == 'success' || activeView == 'failed') && goBack();
            }
            setDoResetStack(false);
          }}
          snapPoints={[getSnapPoints(), '90%']}>
          <View style={styles.bottomSheetContent}>
            {renderBottomSheetContent()}
          </View>
        </BottomSheetComponent>
      </View>
    </View>
  );
};
export default RSVPInvitedUpcoming;

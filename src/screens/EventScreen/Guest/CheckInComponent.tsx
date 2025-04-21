import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { ROUTES } from 'src/navigation/Route';
import {
  useGuestCheckInMutation,
  useManageGuestMutation,
} from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { setManageGuestRefresh, setManageGuestSkip } from 'src/redux/slices/listSkipSlice';
import { BUTTON_LABLE, COLORS, LABLE } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import {
  ApiErrorInterface,
  fontFamily,
  getErrorMessage,
} from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { ManageGuestPayload } from '../types';
import { debounce } from 'lodash';

interface AdditionalGuest {
  addedBy: string;
  category: any[];
  checkIn: boolean;
  firstName: string;
  gender: string;
  guestId: string;
  id: string;
  interest: string[];
  invitationSource: string;
  lastName: string;
  privateGuestNote: string;
}
interface CheckInComponentProps {
  additionalGuests: AdditionalGuest[];
  ticketType: string;
  privateGuestNote: string;
  maxAdditionalGuests: number;
  status?: string;
  guestProfile?: any;
  selectedTicketType?: any;
  isPastEvent: boolean;
}
const RenderItemComponent = ({
  item,
  index,
  expandList = [],
  toggleExpand,
  checkInPlusOne,
  navigation,
  isCheckInLoading,
  onChangeGuestNote,
  selectedGuestForCheckIn,
  isPastEvent
}: {
  item: any;
  index: number;
  expandList: {
    id: number;
    isExpand: boolean;
    isPending: boolean;
    additionalGuest: any;
  }[];
  toggleExpand: any;
  checkInPlusOne: any;
  navigation: any;
  isCheckInLoading: boolean;
  selectedGuestForCheckIn: string;
  onChangeGuestNote: (guestNote: string) => void;
  isPastEvent: boolean
}) => {
  const inputRef = useRef<TextInput>(null);
  const { updateKeyboardStatus } = useKeyboard(inputRef);

  const getAvatar = (item: any): any => {
    return (
      item?.additionalGuest?.firstName + ' ' + item?.additionalGuest?.lastName
    );
  };
  const handleProfilePress = () => {
    navigation.navigate(ROUTES.UserDetail, {
      user: item?.additionalGuest?.id,
    });
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => onChangeGuestNote(text), 3000),
    [],
  );
  const handleNoteChange = useCallback((text: string) => {
    debouncedSearch(text);
  }, []);

  return (
    <View style={[styles.card, { padding: 0 }]}>
      <View
        style={[
          styles.guestCard,
          expandList[index]?.isExpand
            ? styles.bottomRadius
            : {
              borderBottomStartRadius: radiusScale(16),
              borderBottomRightRadius: radiusScale(16),
            },
        ]}>
        <View style={styles.guestHeader}>
          {item?.isPending ? (
            <Image source={IMAGES.user_gray} />
          ) : (
            <AvatarInitials
              name={!item?.isPending ? getAvatar(item) : null}
              size={32}
              backgroundColor={COLORS.white}
            />
          )}
          <Text style={styles.guestUsername}>
            {item?.additionalGuest?.firstName}
          </Text>
          {!item?.isPending && item?.additionalGuest?.checkIn ? (
            <Button
              onPress={() =>
                checkInPlusOne(
                  item?.additionalGuest?.guestId,
                  item?.additionalGuest?.checkIn,
                )
              }
              title={LABLE.CHECKED_IN}
              imageSource={IMAGES.checkedinCurved}
              style={[
                styles.checkInButton,
                {
                  width: Wp(35),
                },
              ]}
              leftImageStyle={styles.actionButtonIcon}
              loading={
                isCheckInLoading &&
                selectedGuestForCheckIn === item?.additionalGuest?.guestId
              }
              disabled={
                (isCheckInLoading &&
                  selectedGuestForCheckIn === item?.additionalGuest?.guestId)
              }
            />
          ) : !item?.isPending && !item?.additionalGuest?.checkIn ? (
            <Button
              onPress={() =>
                checkInPlusOne(
                  item?.additionalGuest?.guestId,
                  item?.additionalGuest?.checkIn,
                )
              }
              title={LABLE.CHECK_IN}
              imageSource={IMAGES.checkinCurved}
              style={[
                styles.checkInButton,
                {
                  width: Wp(30),
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.borderGray,
                },
              ]}
              leftImageStyle={styles.actionButtonIcon}
              loading={
                isCheckInLoading &&
                selectedGuestForCheckIn === item?.additionalGuest?.guestId
              }
              disabled={
                isCheckInLoading &&
                selectedGuestForCheckIn === item?.additionalGuest?.guestId
              }
            />
          ) : (
            <View style={styles.pendingDetailsButton}>
              <Image source={IMAGES.alertTriangle} />
              <Text style={styles.pendingDetailsText}>
                {LABLE.PENDING_DETAILS}
              </Text>
            </View>
          )}
          {!item?.isPending && (
            <TouchableOpacity onPress={() => toggleExpand(item)}>
              <Image
                resizeMode="contain"
                source={
                  item?.isExpand ? IMAGES.arrowupCircle : IMAGES.arrowDownCircle
                }
              />
            </TouchableOpacity>
          )}
        </View>

        {expandList[index]?.isExpand && (
          <View style={{ marginTop: verticalMarginScale(16) }}>
            <Text style={styles.label}>{LABLE.GUEST_NOTE}</Text>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  backgroundColor: !item?.additionalGuest?.checkIn
                    ? COLORS.white
                    : COLORS.bgGray,
                },
              ]}
              editable={!item?.additionalGuest?.checkIn ? isPastEvent ? false : true : false}
              placeholder={LABLE.PLACEHOLDER_PRIVATE_NOTE}
              defaultValue={item?.additionalGuest.privateGuestNote}
              multiline
              onFocus={() => updateKeyboardStatus(true)}
              onBlur={() => updateKeyboardStatus(false)}
              onChangeText={text => {
                handleNoteChange(text);
              }}
            />
          </View>
        )}
      </View>

      {expandList[index]?.isExpand && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}>
          <Image resizeMode="contain" source={IMAGES.arrow_up_right} />
          <Text style={styles.profileText}>{BUTTON_LABLE.PROFILE}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const CheckInComponent: React.FC<CheckInComponentProps> = ({
  additionalGuests = [],
  ticketType,
  privateGuestNote,
  maxAdditionalGuests,
  status,
  guestProfile,
  selectedTicketType,
  isPastEvent
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { updateKeyboardStatus } = useKeyboard();

  const [selectedGuestForCheckin, setSelectedGuestForCheckin] =
    useState<string>('');
  const [checkedIn, setCheckedIn] = useState(guestProfile?.checkIn);
  const [isShownCard, setIsShownCard] = useState(true);
  const [guestNote, setGuestNote] = useState(privateGuestNote);
  const [expandlist, setExpandList] = useState<
    {
      id: number;
      isExpand: boolean;
      isPending: boolean;
      additionalGuest: any;
    }[]
  >([]);

  const selectedEvent = useSelector(
    (state: RootState) => state.inviteGuestsFlow.selectedEvent,
  );

  const [manageGuest] = useManageGuestMutation();
  const [
    guestCheckIn,
    { error: guestCheckInError, isLoading: guestCheckInLoading },
  ] = useGuestCheckInMutation();

  const pendingGuestCount = maxAdditionalGuests - additionalGuests.length;
  const guestString = pendingGuestCount > 1 ? ' Guests' : ' Guest';

  useEffect(() => {
    let expandIndex = additionalGuests.map((guest, index) => ({
      id: index,
      isExpand: false,
      isPending: false,
      additionalGuest: guest,
    }));

    if (expandIndex.length < maxAdditionalGuests) {
      expandIndex.push({
        id: expandIndex.length,
        isExpand: false,
        isPending: true,
        additionalGuest: { firstName: pendingGuestCount + guestString },
      });
    }
    setExpandList(expandIndex);
  }, [ticketType]);

  const toggleExpand = (guest: any) => {
    console.log('expandlist', guest?.isExpand);
    console.log(
      'expandlist???',
      expandlist.map(item =>
        item.id === guest?.id ? { ...item, isExpand: !item.isExpand } : item,
      ),
    );
    setExpandList(
      expandlist.map(item =>
        item.id === guest?.id ? { ...item, isExpand: !item.isExpand } : item,
      ),
    );
  };
  const handleCardShown = () => {
    setIsShownCard(!isShownCard);
  };

  const handleCheckIn = async (
    guestId: string,
    checkIn: boolean,
    isPlusOne: boolean,
  ) => {
    setSelectedGuestForCheckin(guestId);
    try {
      const response = await guestCheckIn({
        guestId: guestId,
        checkIn: checkIn,
      }).unwrap();
      if (response.success) {
        dispatch(setManageGuestRefresh());
        if (isPlusOne) {
          setExpandList(prevList =>
            prevList.map(item =>
              item.additionalGuest.guestId === guestId
                ? {
                  ...item,
                  additionalGuest: {
                    ...item.additionalGuest,
                    checkIn: response.data.checkInStatus,
                  },
                }
                : item,
            ),
          );
        } else {
          setCheckedIn(response.data.checkInStatus);
        }
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    } finally {
    }
  };

  const debouncedSearch = useCallback(
    debounce(
      (newGuestNote: string, guestId: string) =>
        handleGuestAction(newGuestNote, guestId),
      3000,
    ),
    [],
  );
  const handleNoteChange = useCallback(
    (newGuestNote: string, guestId: string) => {
      debouncedSearch(newGuestNote, guestId);
    },
    [],
  );

  const handleGuestAction = async (newGuestNote: string, guestId: string) => {
    if (status === 'CONFIRMED' && selectedEvent?.id) {
      try {
        const payload: ManageGuestPayload = {
          action: 'UPDATE',
          currentStatus: 'CONFIRMED',
          exclusiveIds: [],
          guestStatus: 'CONFIRMED',
          inclusiveIds: [guestId],
          inviteMessage: '',
          isSelectedAll: false,
          maxAdditionalGuests: maxAdditionalGuests,
          sendNotification: true,
          ticketTypeId: selectedTicketType?.id,
          privateGuestNote: newGuestNote,
        };

        await manageGuest({
          payload,
          eventId: selectedEvent?.id,
        }).unwrap();

        dispatch(setManageGuestRefresh());
        // FlashMessageComponent.show(
        //   'success',
        //   `${guestProfile?.name}'s invite has been updated`,
        // );

        // navigation.goBack();
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      } finally {
        // setIsLoadingAction(false);
      }
    }
  };

  return (
    <View style={styles.card}>
      <View
        style={[styles.header, { borderBottomWidth: !isShownCard ? 0 : 1 }]}>
        <Text style={styles.headerText}>{LABLE.GUEST_CHICKED_IN}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleCardShown}>
          <Image
            resizeMode="contain"
            source={isShownCard ? IMAGES.arrowUpgray : IMAGES.arrowDowngray}
          />
        </TouchableOpacity>
      </View>

      {isShownCard && (
        <>
          {status !== 'CONFIRMED' ? (
            <View style={styles.section}>
              <Text style={styles.label}>
                {LABLE.TICKET_TYPE} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{ticketType}</Text>
                <Image resizeMode="contain" source={IMAGES.downArrow} />
              </View>
            </View>
          ) : (
            <View style={styles.guestCheckInCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AvatarInitials
                  size={32}
                  name={guestProfile?.name}
                  imgUrl={guestProfile?.profilePicture}
                />
                <View style={{ paddingLeft: verticalMarginScale(8) }}>
                  <Text style={styles.username}>{guestProfile?.name}</Text>
                </View>
              </View>

              <Button
                onPress={() =>
                  handleCheckIn(guestProfile.guestId, !checkedIn, false)
                }
                title={checkedIn ? LABLE.CHECKED_IN : LABLE.CHECK_IN}
                imageSource={
                  checkedIn ? IMAGES.checkedinCurved : IMAGES.checkinCurved
                }
                style={[
                  styles.checkInButton,
                  styles.whiteBtn,
                  { width: '100%' },
                  checkedIn && styles.greenBtn,
                ]}
                leftImageStyle={styles.actionButtonIcon}
                loading={
                  guestCheckInLoading &&
                  selectedGuestForCheckin === guestProfile.guestId
                }
                disabled={
                  (guestCheckInLoading &&
                    selectedGuestForCheckin === guestProfile.guestId)
                }
              />
              {/* <TouchableOpacity
                style={[
                  styles.checkInButton,
                  styles.whiteBtn,
                  checkedIn && styles.greenBtn,
                ]}
                onPress={handleCheckIn}>
                <Image
                  resizeMode="contain"
                  source={
                    checkedIn ? IMAGES.checkedinCurved : IMAGES.checkinCurved
                  }
                  // style={styles.actionButtonIcon}
                />
                <Text style={styles.actionButtonText}>
                  {checkedIn ? LABLE.CHECKED_IN : LABLE.CHECK_IN}
                </Text>
              </TouchableOpacity> */}
            </View>
          )}

          <Text style={styles.sectionTitle}>{LABLE.LEAD_GUEST}</Text>

          <View style={styles.section}>
            <Text style={styles.label}>{LABLE.GUEST_NOTE}</Text>
            <TextInput
              onChangeText={text => {
                handleNoteChange(text, guestProfile?.guestId);
                setGuestNote(text);
              }}
              style={[
                styles.input,
                {
                  backgroundColor:
                    status === 'CONFIRMED' && !isPastEvent ? COLORS.white : COLORS.bgGray,
                },
              ]}
              placeholder={LABLE.PLACEHOLDER_PRIVATE_NOTE}
              defaultValue={privateGuestNote}
              multiline
              editable={status === 'CONFIRMED' && !isPastEvent}
              onFocus={() => {
                updateKeyboardStatus(true);
              }}
              onBlur={() => {
                updateKeyboardStatus(false);
              }}

            />
          </View>
          <Text style={styles.sectionTitle}>{LABLE.PLUS_1S}</Text>
          <FlatList
            data={expandlist || []}
            keyExtractor={item => item?.id?.toString()}
            nestedScrollEnabled
            renderItem={({ item, index }) => (
              <RenderItemComponent
                item={item}
                index={index}
                expandList={expandlist || []}
                toggleExpand={toggleExpand}
                navigation={navigation}
                checkInPlusOne={(guestId, checkIn) =>
                  handleCheckIn(guestId, !checkIn, true)
                }
                onChangeGuestNote={newGuestNote => {
                  handleGuestAction(newGuestNote, item.additionalGuest.guestId);
                }}
                isCheckInLoading={guestCheckInLoading}
                selectedGuestForCheckIn={selectedGuestForCheckin}
                isPastEvent={isPastEvent}
              />
            )}
          //   contentContainerStyle={styles.container}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: verticalMarginScale(16),
    borderRadius: radiusScale(16),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingBottom: verticalMarginScale(8),
    borderRadius: radiusScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E1E3E6',
  },
  headerText: {
    fontSize: radiusScale(18),
    fontWeight: '700',
  },
  iconButton: {
    padding: verticalMarginScale(5),
  },
  iconText: {
    fontSize: fontScale(16),
  },
  section: {
    marginTop: verticalMarginScale(10),
  },
  label: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgGray,
    padding: verticalMarginScale(10),
    height: verticalScale(40),
    borderRadius: radiusScale(8),
    marginTop: verticalMarginScale(5),
    borderWidth: 1,
    borderColor: COLORS.borderBlur,
  },
  dropdownText: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: '700',
    marginTop: verticalMarginScale(20),
  },
  input: {
    backgroundColor: COLORS.bgGray,
    padding: verticalMarginScale(10),
    borderWidth: 1,
    borderColor: COLORS.borderBlur,
    borderRadius: radiusScale(8),
    marginTop: verticalMarginScale(5),
    minHeight: verticalScale(120),
    textAlignVertical: 'top',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  guestCard: {
    backgroundColor: COLORS.lighter_gray,
    padding: 15,
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
  },
  bottomRadius: {
    borderBottomStartRadius: radiusScale(1),
    borderBottomRightRadius: radiusScale(1),
  },
  guestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestAvatar: {
    backgroundColor: '#ddd',
    padding: verticalMarginScale(10),
    borderRadius: radiusScale(20),
    fontWeight: 'bold',
    marginRight: verticalMarginScale(10),
  },
  guestUsername: {
    flex: 1,
    paddingLeft: verticalMarginScale(8),
    fontSize: fontScale(14),
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGreen,
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
    marginRight: verticalMarginScale(8),
    height: verticalScale(40),
  },
  whiteBtn: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.bgGray,
  },
  greenBtn: {
    backgroundColor: COLORS.bgGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
  },
  checkInText: {
    color: '#555',
    paddingLeft: verticalMarginScale(8),
  },
  profileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    margin: verticalMarginScale(10),
    alignItems: 'center',
  },
  profileText: {
    color: COLORS.black,
    paddingLeft: verticalMarginScale(8),
  },
  guestCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: verticalMarginScale(15),
    borderRadius: radiusScale(10),
    marginTop: verticalMarginScale(15),
    elevation: 2,
  },
  guestCountText: {
    fontSize: fontScale(16),
    fontWeight: 'bold',
  },
  pendingDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.yellowbackground,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
  },
  pendingDetailsText: {
    color: COLORS.black,
    fontSize: fontScale(14),
    paddingLeft: verticalMarginScale(8),
  },
  checkedInBanner: {
    backgroundColor: '#222',
    padding: verticalMarginScale(15),
    marginTop: verticalMarginScale(15),
    borderRadius: radiusScale(10),
    alignItems: 'center',
  },
  checkedInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  guestCheckInCard: {
    backgroundColor: COLORS.lighter_gray,
    padding: verticalMarginScale(16),
    borderRadius: radiusScale(16),
    borderColor: COLORS.borderGray,
    borderWidth: 1,

    marginTop: verticalMarginScale(16),
  },
  username: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: verticalScale(40),
    gap: horizontalMarginScale(4),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
  },
  actionButtonText: {
    fontSize: fontScale(14),
    paddingLeft: 8,
    color: COLORS.black,
    fontWeight: '500',
  },
  actionButtonIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    resizeMode: 'contain',
  },
  // checkInButton: {
  //   flex: 0,
  //   backgroundColor: COLORS.bgGreen,
  //   borderWidth: 1,
  //   borderColor: COLORS.borderGreen,
  //   width: '70%',
  // },
});

export default CheckInComponent;

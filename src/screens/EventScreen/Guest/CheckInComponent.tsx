import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Image } from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import AvatarInitials from 'src/component/AvatarInitials';
import { ROUTES } from 'src/navigation/Route';
import { useManageGuestMutation } from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { BUTTON_LABLE, COLORS, LABLE } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { GuestStatus, ManageGuestPayload } from '../types';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';

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
}
const renderItemComponent = (
  item: any,
  index: number,
  expandList: any[],
  toggleExpand: any,
  navigation: any,
) => {
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
  return (
    <View style={[styles.card, { padding: 0 }]}>
      <View style={[styles.guestCard, true && styles.bottomRadius]}>
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
            <View style={styles.checkInButton}>
              <Image source={IMAGES.checkedinCurved} />
              <Text style={styles.checkInText}>{LABLE.CHECKED_IN}</Text>
            </View>
          ) : !item?.isPending && !item?.additionalGuest?.checkIn ? (
            <View
              style={[
                styles.checkInButton,
                {
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.borderGray,
                },
              ]}>
              <Image source={IMAGES.checkinCurved} />
              <Text style={styles.checkInText}>{LABLE.CHECK_IN}</Text>
            </View>
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
              style={styles.input}
              placeholder={LABLE.PLACEHOLDER_PRIVATE_NOTE}
              defaultValue={item?.additionalGuest.privateGuestNote}
              multiline
            />
          </View>
        )}
      </View>

      {expandList[index]?.isExpand && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}>
          <Image source={IMAGES.arrow_up_right} />
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
}) => {
  const navigation = useNavigation();
  const { apiRequest, loading, error } = useApi();
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

  const pendingGuestCount = maxAdditionalGuests - additionalGuests.length;
  const guestString = pendingGuestCount > 1 ? ' Guests' : ' Guest';

  // const [manageGuest] = useManageGuestMutation();

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
  const validateDetails = async () => {
    const response: any = await apiRequest(
      'post',
      `events/v1/guest/ticket/${guestProfile.guestId}/validate`,
      {
        checkIn: !checkedIn,
      },
    );
    if (response.success) {
      setCheckedIn(response.data.checkInStatus);
    }
  };

  const handleCheckIn = () => {
    validateDetails();
  };

  const manageGuests = async () => {
    if (status === 'CONFIRMED' && selectedEvent?.id) {
      // try {
      //   const payload: ManageGuestPayload = {
      //     action: 'UPDATE',
      //     currentStatus: status as GuestStatus,
      //     guestStatus: 'CONFIRMED',
      //     exclusiveIds: [],
      //     inclusiveIds: additionalGuests.map(guest => guest.id),
      //     privateGuestNote: guestNote,
      //     sendNotification: false,
      //     isSelectedAll: false,
      //   };

      //   await manageGuest({
      //     payload,
      //     eventId: selectedEvent?.id,
      //   }).unwrap();
      // } catch (error) {
      //   const typedError = error as ApiErrorInterface;
      //   FlashMessageComponent.show('error', getErrorMessage(typedError));
      // }

      const response: any = await apiRequest(
        'put',
        EndPoint.event_manage_guests + '?eventId=' + selectedEvent?.id,
        {
          action: 'UPDATE',
          bulkUploadStatus: false,
          exclusiveIds: [],
          guestStatus: 'CONFIRMED',
          inclusiveIds: additionalGuests.map(guest => guest.id),
          isSelectedAll: false,
          privateGuestNote: guestNote,
        },
      );
      if (response.success) {
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
                <Image source={IMAGES.downArrow} />
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

              <TouchableOpacity
                style={[
                  styles.checkInButton,
                  styles.whiteBtn,
                  checkedIn && styles.greenBtn,
                ]}
                onPress={handleCheckIn}>
                <Image
                  source={
                    checkedIn ? IMAGES.checkedinCurved : IMAGES.checkinCurved
                  }
                  // style={styles.actionButtonIcon}
                />
                <Text style={styles.actionButtonText}>
                  {checkedIn ? LABLE.CHECKED_IN : LABLE.CHECK_IN}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionTitle}>{LABLE.LEAD_GUEST}</Text>

          <View style={styles.section}>
            <Text style={styles.label}>{LABLE.GUEST_NOTE}</Text>
            <TextInput
              onChangeText={text => setGuestNote(text)}
              style={[
                styles.input,
                {
                  backgroundColor:
                    status === 'CONFIRMED' ? COLORS.white : COLORS.bgGray,
                },
              ]}
              placeholder={LABLE.PLACEHOLDER_PRIVATE_NOTE}
              defaultValue={privateGuestNote}
              multiline
              editable={status === 'CONFIRMED' ? true : false}
              onBlur={manageGuests}
            />
          </View>
          <Text style={styles.sectionTitle}>{LABLE.PLUS_1S}</Text>
          <FlatList
            data={expandlist || []}
            keyExtractor={item => item?.id?.toString()}
            nestedScrollEnabled
            renderItem={({ item, index }) =>
              renderItemComponent(
                item,
                index,
                expandlist,
                toggleExpand,
                navigation,
              )
            }
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
  },
  guestCard: {
    backgroundColor: COLORS.lighter_gray,
    padding: 15,
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
  },
  bottomRadius: {
    borderBottomStartRadius: radiusScale(16),
    borderBottomRightRadius: radiusScale(16),
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

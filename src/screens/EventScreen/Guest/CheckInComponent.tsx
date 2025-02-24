import IMAGES from '@images/index';
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
import AvatarInitials from 'src/component/AvatarInitials';
import { BUTTON_LABLE, COLORS, LABLE } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

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
}
const renderItemComponent = (
  item: any,
  index: number,
  expandList: any[],
  toggleExpand: any,
) => {
  const getAvatar = (item: any): any => {
    return (
      item?.additionalGuest?.firstName + ' ' + item?.additionalGuest?.lastName
    );
  };
  console.log('getAvatar', getAvatar(item));
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
        <TouchableOpacity style={styles.profileButton}>
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
}) => {
  const [expandlist, setExpandList] = useState<
    {
      id: number;
      isExpand: boolean;
      isPending: boolean;
      additionalGuest: any;
    }[]
  >([]);

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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{LABLE.GUEST_CHICKED_IN}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={IMAGES.arrowUpgray} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          {LABLE.TICKET_TYPE} <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>{ticketType}</Text>
          <Image source={IMAGES.downArrow} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>{LABLE.LEAD_GUEST}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{LABLE.GUEST_NOTE}</Text>
        <TextInput
          style={styles.input}
          placeholder={LABLE.PLACEHOLDER_PRIVATE_NOTE}
          defaultValue={privateGuestNote}
          multiline
          editable={false}
        />
      </View>
      <Text style={styles.sectionTitle}>{LABLE.PLUS_1S}</Text>
     <FlatList
          data={expandlist || []}
          keyExtractor={item => item?.id?.toString()}
          nestedScrollEnabled
          renderItem={({ item, index }) =>
            renderItemComponent(item, index, expandlist, toggleExpand)
          }
          //   contentContainerStyle={styles.container}
        />
    
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
});

export default CheckInComponent;

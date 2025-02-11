import IMAGES from '@images/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import ConfirmationBottomSheet from 'src/component/BottomSheet/ConfirmationBottomSheet';
import ListComponentBottomSheet from 'src/component/BottomSheet/ListComponentBottomSheet';
import Button from 'src/component/Button';
import CustomSelectableText from 'src/component/CustomSelectableText/CustomSelectableText';
import Header from 'src/component/Header/Header';
import Toast from 'src/component/Toast/Toast';
import { deleteGuest, setResponse, setSelectedGuest } from 'src/redux/slices/rspvSlice';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  LABLE,
  PROFILE,
} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import useContacts from 'src/utils/hooks/useContactPermission';
import { SwipeableGuestList } from './SwipeableGuestList';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import { CustomText } from 'src/component/CustomText';
import { styles } from './styles';

const optionList = [
  { id: 1, label: 'Cancel Application' },
];
const invites = [{
  "addedBy": "",
  "addedByPicture": "",
  "age": 0,
  "category": [],
  "checkIn": false,
  "email": "akash.kothawade+1036@techalchemy.com",
  "firstName": "sky",
  "guestId": "f5ec8047-487d-4474-bc44-383f9dc61bba",
  "guestStatus": "CONFIRMED",
  "id": "f5ec8047-487d-4474-bc44-383f9dc61bba",
  "invitationSource": -1,
  "invitees": [],
  "lastName": "test",
  "phoneNumber": "+9087654567",
  "profilePicture": "",
  "source": "",
  "status": "NO_STATUS",
  "userId": "c8d62410-953f-4f5c-9c8f-666ea9b55b60",
  "username": ""
},
{
  "addedBy": "",
  "addedByPicture": "",
  "age": 0,
  "category": [],
  "checkIn": false,
  "email": "akash.kothawade+1037@techalchemy.com",
  "firstName": "sky 2",
  "guestId": "e2f75fa8-fc02-4d68-881b-9a7028bcbafc",
  "guestStatus": "CONFIRMED",
  "id": "e2f75fa8-fc02-4d68-881b-9a7028bcbafc",
  "invitationSource": -1,
  "invitees": [],
  "lastName": "test",
  "phoneNumber": "+9087654567",
  "profilePicture": "",
  "source": "",
  "status": "NO_STATUS",
  "userId": "c1f56ccd-11e9-40e2-990b-8b4c419a52c4",
  "username": ""
},
{
  "addedBy": "",
  "addedByPicture": "",
  "age": 26,
  "category": [],
  "checkIn": false,
  "email": "akash.kothawade+1014@techalchemy.com",
  "firstName": "akash",
  "guestId": "1e454374-f8ad-42e2-8320-0405ddd2f5b9",
  "guestStatus": "DECLINED",
  "id": "09a2fc69-a938-4dc8-8d82-b3c6c78b3606",
  "invitationSource": "INVITED_BY_HOST",
  "invitees": [],
  "lastName": "kakak",
  "maxAdditionalGuests": 4,
  "numberAdditionalGuests": 4,
  "phoneNumber": "+919898907028",
  "profilePicture": "laksdf;lkajsdfljasdjfk",
  "source": "",
  "status": "NO_STATUS",
  "userId": "1aeb0084-e6ad-4878-b1b0-feb1d84ddac9",
  "username": ""
},
{
  "addedBy": "",
  "addedByPicture": "",
  "age": 26,
  "category": [],
  "checkIn": false,
  "email": "akash.kothawade+1024@techalchemy.com",
  "firstName": "akash",
  "guestId": "ccdcea43-f502-4b85-8bdb-f9da17598453",
  "guestStatus": "DECLINED",
  "id": "32aa189e-c978-442b-a73e-988a0ab25735",
  "invitationSource": "INVITED_BY_HOST",
  "invitees": [],
  "lastName": "kakak",
  "maxAdditionalGuests": 4,
  "numberAdditionalGuests": 4,
  "phoneNumber": "+919898909031",
  "profilePicture": "laksdf;lkajsdfljasdjfk",
  "source": "",
  "status": "NO_STATUS",
  "userId": "28052fa2-7237-4562-a5d1-8dcd281fe114",
  "username": ""
}]

const EventCard = () => {
  return (
    <View style={styles.card}>
      <Image source={IMAGES.frame} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>Revolve Festival</Text>
        <Text style={styles.details}>Fri, April 13, 9:00PM - 11:00PM EST</Text>
        <Text style={styles.details}>Los Angeles, California</Text>
      </View>
    </View>
  );
};

const StatusBanner = ({ isGoing, onPress }) => {
  return (isGoing ?
    <TouchableOpacity onPress={onPress} style={styles.statusBanner}>
      <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
        <Image source={IMAGES.tickGoing} />
        <Text style={styles.statusText}> {'You are going'}</Text>
      </View>
      <Image source={IMAGES.downArrow} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
    </TouchableOpacity>
    :
    <View style={styles.statusBanner}>
      <Image source={IMAGES.tickInvited} />
      <Text style={styles.statusText}> {EVENT_STATUS.INVITED}</Text>
    </View>
  );
};

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
const guests = [
  { id: 0, name: 'No Guests' },
  { id: 1, name: 'Guest 1' },
  { id: 2, name: 'Guest 2' },
  { id: 3, name: 'Guest 3' },
  { id: 4, name: 'Guest 4' },
];
const RSVPFormScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [isToastShown, setIsToastShown] = useState(false);
  const [activeView, setActiveTab] = useState<string>('');
  const { requestContactPermission } = useContacts();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<any>(null);
  const [reasonSelected, setReasonSelected] = useState<any>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showYesOptionDropdown, setYesOptionDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState<any>({});
  // const [selectedGuest, setSelectedGuest] = useState<any>(guests[0]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const reasonsRef = useRef<any>(null);
  const guestRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);
  const rspv = useSelector(state => state.rspv);
  const [showInfo, setShowInfo] = useState<boolean | null>(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onClickReason = () => {
    reasonsRef?.current.open();
  };

  const onClickGuest = () => {
    guestRef?.current.open();
  };
  const onAddGuest = async () => {
    await requestContactPermission();
    navigation.navigate('AddGuestOptionScreen');
  };
  const submit = () => {
    if (rspv?.response === null) {
      setIsToastShown(true);
    } else {
      confirmationRef.current.open();
    }
  };

  const handleResponse = (response) => {
    dispatch(setResponse(response));
  };
  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'options':
        return renderOptions();
      case 'cancel':
        return renderCancelPopup();
      default:
        return null;
    }
  };
  const renderCancelPopup = () => (
    <View style={styles.cancelPopupContainer}>
      <CustomText style={styles.eventTitle}>
        Cancel your RSVP?
      </CustomText>
      <CustomText style={styles.descText}>
        This action cannot be undone. If you cancel, your guests will be notified, and their passes will be revoked. To rejoin later, you’ll need to request a new invite from the host.   Please let us know why you can’t make it.
      </CustomText>
      {reasons.map(item => {
        return (
          <TouchableOpacity
            key={item.id.toString()}
            style={[styles.guestButton, reasonSelected === item && { borderWidth: 2, borderColor: COLORS.black, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }]}
            onPress={() => setReasonSelected(item)}>
            {reasonSelected == item && <Image source={IMAGES.check} style={{ width: 16, height: 16 }} />}
            <Text style={styles.guestButtonText}>{item.name}</Text>
            {reasonSelected == item && <View />}

          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={() => { }}
        style={styles.redButton}>
        <Text style={[styles.optionText, { color: COLORS.white }]}>
          Cancel RSPV
        </Text>
      </TouchableOpacity>
    </View>
  );

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

  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'guests':
        return '30%';
      case 'submit':
        return '60%';
      case 'options':
        return '20%';
      case 'cancel':
        return '85%';
      case 'leave':
        return '40%';
      default:
        return '85%';
    }
  };
  const combinedGuests = [
    ...rspv.guests.map(guest => ({ ...guest, type: 'rspv' })),
    ...invites.map(guest => ({ ...guest, type: 'invite' })),
  ];

  const renderItem = ({ item }) => (
    <SwipeableGuestList
      key={item.id}
      guest={item}
      onDelete={item.type === 'rspv' ? () => dispatch(deleteGuest(item.id)) : undefined}
      onInfoClick={item.type === 'invite' ? () => setShowInfo(!showInfo) : undefined}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={BUTTON_LABLE.RSVP}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <ScrollView style={styles.scrollContainer} nestedScrollEnabled>
        <EventCard />
        <StatusBanner isGoing={true} onPress={() => {
          setActiveTab('options')
          bottomSheetRef?.current.open()
        }} />

        {/* <View style={[styles.card, { flexDirection: 'column' }]}>
          <View>
            <Text style={styles.info}>Would you like to attend the event?</Text>
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
                rspv.response == 'No' ? styles.clearButton : styles.smallButton
              }
              colorTheme={rspv.response == 'Yes' ? 'dark' : 'white'}
            />
            <Button
              disabled={false}
              title={BUTTON_LABLE.NO}
              onPress={() => handleResponse('No')}
              style={
                rspv.response == 'No' ? styles.smallButton : styles.clearButton
              }
              clearButtonStyle={
                rspv.response == 'Yes'
                  ? styles.clearButton
                  : styles.smallButton
              }
              colorTheme={rspv.response == 'No' ? 'dark' : 'white'}
            />
          </View>
        </View> */}
        <View style={{ gap: 6 }}>
          <CustomText style={{ color: COLORS.light_gray }}>You have 0 guest passes available </CustomText>
          <FlatList
            data={combinedGuests}
            renderItem={renderItem}
            nestedScrollEnabled
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
          />
        </View>
        {showInfo &&
          <>
            <CustomText style={{ color: COLORS.black, marginTop: 12 }}>Guests can be declined for various reasons, such as:</CustomText>
            <View style={{ padding: 6 }}>
              <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
              <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
              <CustomText style={{ color: COLORS.black }}>•  The guest has already requested an invited or was already invited by the host.</CustomText>
            </View>
          </>
        }
        <Button
          disabled={false}
          style={[styles.clearButton, styles.btnBorder]}
          title={BUTTON_LABLE.ADD_GUEST_DETAILS}
          colorTheme="white"
          onPress={onAddGuest}
        />
        {rspv.response == 'No' && (
          <View style={{ padding: verticalMarginScale(12) }}>
            <Text style={styles.label}>Why can’t you attend?</Text>
            <CustomSelectableText
              placeholder={'Select...'}
              rightImage={IMAGES.downArrow}
              errorMessage={''}
              defaultValue={selectedReason?.name}
              onPress={onClickReason}
              style={{ marginTop: verticalMarginScale(4) }}
            />
            <Text style={styles.infoText}>{LABLE.RSVP_TEXT}</Text>
          </View>
        )}
        {rspv.response == 'Yes' && (
          <>
            <View>
              <Text style={[styles.infoText, { color: COLORS.black }]}>
                {LABLE.RSVP_QUESTION_DETAILS}
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

            {rspv?.selectedGuest?.name != guests[0]?.name && (
              <>
                <View style={{ gap: 6 }}>
                  {rspv.guests.map(guest => (
                    <SwipeableGuestList
                      key={guest.id}
                      guest={guest}
                      onDelete={() => dispatch(deleteGuest(guest.id))}
                    />
                  ))}
                </View>
                {rspv?.selectedGuest?.id > rspv?.guests?.length && <Button
                  disabled={false}
                  style={[styles.clearButton, styles.btnBorder]}
                  title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                  colorTheme="white"
                  onPress={onAddGuest}
                />}
              </>
            )}
          </>
        )}

        <ListComponentBottomSheet
          ref={reasonsRef}
          list={reasons}
          selectedItem={setSelectedReason}
          snapPoints={[Platform.OS === 'android' ? '65%' : '60%']}
        />
        <ListComponentBottomSheet
          ref={guestRef}
          list={guests}
          selectedItem={(guest) => dispatch(setSelectedGuest(guest))}
          snapPoints={[Platform.OS === 'android' ? '45%' : '40%']}
        />
        {/* <ConfirmationBottomSheet
          ref={confirmationRef}
          title={LABLE.WE_WERE_SORRY_CANT_MAKE_IT}
          subTitle={LABLE.RSVP_SUBTITLE}
          status={LABLE.YOU_DECLINED_THIS_INVITATION}
          btnLabel={LABLE.DISCOVER_MORE_EVENTS}
          snapPoints={[Platform.OS === 'android' ? '40%' : '38%']}
          btnStyle={[styles.clearButton, styles.btnBorder]}
        /> */}
        <ConfirmationBottomSheet
          ref={confirmationRef}
          title={LABLE.YOUR_RSPV_IS}
          subTitle={LABLE.YOU_CAN_RETURN_TO_THE}
          status={"You are going"}
          isSuccess={true}
          btnLabel={LABLE.DISCOVER_MORE_EVENTS}
          snapPoints={[Platform.OS === 'android' ? '40%' : '38%']}
          btnStyle={[styles.clearButton, styles.btnBorder]}
        />
      </ScrollView>
      {showYesOptionDropdown && (
        <Text style={[styles.infoText, styles.bottomText]}>
          {LABLE.RSVP_INSTRUCTION}
        </Text>
      )}
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMIT}
        colorTheme="dark"
        onPress={submit}
      />
      {isToastShown && (
        <View style={styles.toastWrapper}>
          <Toast
            message={'Please select at least one'}
            onClose={() => setIsToastShown(false)}
          />
        </View>
      )}
      <BottomSheetComponent
        ref={bottomSheetRef}
        snapPoints={[getSnapPoints()]}>
        <View style={styles.bottomSheetContent}>
          {renderBottomSheetContent()}
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
};



export default RSVPFormScreen;

import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Header from 'src/component/Header/Header';
import { EventStackParamList } from 'src/navigation/EventStack';
import {
  useInviteGuestsMutation,
  useInviteNewGuestsMutation,
} from 'src/redux/actions/inviteGuestsApiAction';
import { RootState } from 'src/redux/slices';
import { setSelectedUsersToInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
import InviteDetails from 'src/screens/EventScreen/Guest/InviteGuestDetailForm';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {
  ApiErrorInterface,
  changeSafeAreaViewConfig,
  getErrorMessage,
} from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import TicketTypeBottomSheet, { TicketType } from '../TicketTypeBottomSheet';
import createStyles from './styles';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import IMAGES from '@images/index';
import PhoneNumberInput, {
  countryType,
  PhoneNumberInputRefMethods,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';

interface ManageGuestsProps
  extends NativeStackScreenProps<EventStackParamList, 'ManageGuestsScreen'> {}

const ManageGuests: React.FC<ManageGuestsProps> = ({ route }) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();
  const { isManual, type } = route.params;

  const firstNameRef = useRef<InputRefMethods>(null);
  const lastNameRef = useRef<InputRefMethods>(null);
  const phoneRef = useRef<PhoneNumberInputRefMethods>(null);
  const emailRef = useRef<InputRefMethods>(null);
  const ticketTypeRef = useRef<InputRefMethods>(null);

  const actionSheetRef = useRef<BottomSheetMethods>(null);

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = useState<number>(0);
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [guestNote, setGuestNote] = useState<string>('');
  const [directlySendToConfirm, setDirectlySendToConfirm] =
    useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<countryType | null>(
    null,
  );

  const [isDraftInvite, setIsDraftInvite] = useState<boolean>();

  const { selectedUsers, selectedEvent, selectedManualUser } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      selectedEvent: state.inviteGuestsFlow.selectedEvent,
      selectedManualUser: state.inviteGuestsFlow.selectedManualUser,
    }),
    shallowEqual,
  );

  const [
    inviteGuests,
    { error: inviteGuestsError, isLoading: inviteGuestsLoading },
  ] = useInviteGuestsMutation();
  const [
    inviteNewGuests,
    { error: inviteNewGuestsError, isLoading: inviteNewGuestsLoading },
  ] = useInviteNewGuestsMutation();

  const validateForm = () => {
    if (!selectedTicketType) {
      ticketTypeRef?.current?.setErrorMessage('Ticket type required');
      return false;
    }
    ticketTypeRef?.current?.setErrorMessage('');
    return true;
  };

  const onPressCta = async (sendInvite: boolean) => {
    setIsDraftInvite(!sendInvite);
    const formValidated = validateForm();
    if (formValidated) {
      try {
        const response = await inviteGuests({
          eventId: selectedEvent?.id || '',
          payload: {
            guestStatus: directlySendToConfirm
              ? 'CONFIRMED'
              : sendInvite
              ? 'INVITED'
              : 'DRAFT',
            maxAdditionalGuests: selectedEvent?.limitOnePlus || 0,
            sendInvite: sendInvite,
            ticketTypeId: selectedTicketType?.id || '',
            users: selectedUsers.map((item, index) => item.id),
            inviteMessage: inviteMessage,
            privateGuestNote: guestNote,
          },
        }).unwrap();

        if (response.status === 200) {
          FlashMessageComponent.show(
            'success',
            `${selectedUsers.length} ${
              sendInvite
                ? 'Guests have been invited to this event'
                : 'Guests have been saved as drafts'
            }`,
          );
          dispatch(setSelectedUsersToInvite([]));
          navigation.goBack();
        } else {
          const typedError = response as ApiErrorInterface;
          FlashMessageComponent.show('error', getErrorMessage(typedError));
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    }
  };

  const onPressSendManualInvite = async () => {
    firstNameRef?.current?.validateInputs();
    lastNameRef?.current?.validateInputs();

    if (type === 'contact') {
      phoneRef?.current?.validatePhoneNumber();
      if (!phoneRef?.current?.validatePhoneNumber()) {
        phoneRef?.current?.setErrorMessage(
          'Please enter a phone number in the correct format to continue',
        );
      }
      if (
        !firstNameRef?.current?.validateInputs() ||
        !lastNameRef?.current?.validateInputs() ||
        !phoneRef?.current?.validatePhoneNumber()
      ) {
        return;
      }
    }

    if (type === 'email') {
      emailRef?.current?.validateInputs();
      if (
        !firstNameRef?.current?.validateInputs() ||
        !lastNameRef?.current?.validateInputs() ||
        !emailRef?.current?.validateInputs()
      ) {
        return;
      }
    }

    const formValidated = validateForm();
    if (!formValidated) {
      return;
    }

    try {
      const newUserInvitePayload: {
        guestStatus: string;
        inviteMessage: string;
        maxAdditionalGuests: number;
        privateGuestNote: string;
        sendInvite: boolean;
        ticketTypeId: string;
        firstName: string;
        lastName: string;
        email?: string;
        phoneNumber?: string;
      } = {
        guestStatus: directlySendToConfirm ? 'CONFIRMED' : 'INVITED',
        maxAdditionalGuests: selectedEvent?.limitOnePlus || 0,
        sendInvite: true,
        ticketTypeId: selectedTicketType?.id || '',
        inviteMessage: inviteMessage,
        privateGuestNote: guestNote,
        email: email,
        phoneNumber: phone,
        firstName: firstName,
        lastName: lastName,
      };
      if (type === 'email') {
        delete newUserInvitePayload.phoneNumber;
      }
      if (type === 'contact') {
        delete newUserInvitePayload.email;
      }

      const response = await inviteNewGuests({
        eventId: selectedEvent?.id || '',
        payload: newUserInvitePayload,
      }).unwrap();

      if (response.status === 200) {
        FlashMessageComponent.show(
          'success',
          `Guest has been invited to this event`,
        );
        dispatch(setSelectedUsersToInvite([]));
        navigation.goBack();
      } else {
        const typedError = response as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  useEffect(() => {
    if (selectedTicketType) {
      ticketTypeRef?.current?.setErrorMessage('');
    }
  }, [selectedTicketType]);

  useEffect(() => {
    if (isManual && type === 'contact') {
      setFirstName(selectedManualUser?.firstName || '');
      setLastName(selectedManualUser?.lastName || '');
      phoneRef?.current?.setPhoneNumber(selectedManualUser?.phoneNumber || '');
      setPhone(selectedManualUser?.phoneNumber || '');
    }
  }, [isManual, type, selectedManualUser]);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  const slicedSelectedUsers =
    selectedUsers.length > 6 ? selectedUsers.slice(0, 6) : selectedUsers;

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Manage Invite"
        showProgressBar={false}
        rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
      />
      <ScrollView
        contentContainerStyle={{
          gap: verticalMarginScale(16),
          paddingBottom: verticalMarginScale(50),
        }}>
        <View
          style={[
            styles.contentWrapper,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          {isManual ? (
            <View style={{ flex: 1, gap: verticalMarginScale(24) }}>
              <View style={styles.bannerTextContainer}>
                <Image
                  source={IMAGES.info}
                  style={styles.bannerInfo}
                  resizeMode="contain"
                />
                <CustomText style={{ flex: 1 }}>
                  {
                    'Your changes will only be saved in Rumor and will not impact your device’s contact list.'
                  }
                </CustomText>
              </View>
              <Input
                ref={firstNameRef}
                defaultValue={firstName}
                label="First Name"
                errorMessage="First name is required"
                placeholder=""
                onChangeText={setFirstName}
                otherStyle={{ marginTop: 0 }}
                inputFieldContainerStyle={styles.inputStyle}
              />
              <Input
                ref={lastNameRef}
                defaultValue={lastName}
                label="Last Name"
                errorMessage="Last name is required"
                placeholder=""
                onChangeText={setLastName}
                otherStyle={{ marginTop: 0 }}
                inputFieldContainerStyle={styles.inputStyle}
              />
              {type === 'contact' ? (
                <PhoneNumberInput
                  ref={phoneRef}
                  label="Phone Number"
                  onChangeText={text => setPhone(text)}
                  onSelectCountry={setSelectedCountry}
                  inputContainerStyle={styles.inputStyle}
                />
              ) : null}
              {type === 'email' ? (
                <Input
                  ref={emailRef}
                  defaultValue={email}
                  label="Email"
                  errorMessage="Please enter an email address in the correct format to continue"
                  placeholder=""
                  onChangeText={setEmail}
                  otherStyle={{ marginTop: 0 }}
                  inputFieldContainerStyle={styles.inputStyle}
                />
              ) : null}
            </View>
          ) : (
            <>
              <CustomText style={styles.title}>
                {`${selectedUsers.length} Recipients`}
              </CustomText>
              <View style={styles.usersAvatarContainer}>
                {slicedSelectedUsers.map((item, index) => {
                  return (
                    <AvatarInitials
                      key={item.id}
                      imgUrl={item.profilePicture}
                      name={item.name}
                      size={verticalScale(32)}
                      containerStyle={{
                        ...styles.avatarContainer,
                        ...{
                          marginRight:
                            slicedSelectedUsers.length - 1 !== index
                              ? -verticalScale(14)
                              : 0,
                        },
                      }}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>

        <View style={{ marginHorizontal: horizontalMarginScale(16) }}>
          <InviteDetails
            isCollapsible
            selectedTicketType={selectedTicketType}
            ticketTypeRef={ticketTypeRef}
            onTicketTypePress={() => actionSheetRef?.current?.open()}
            additionalGuests={additionalGuests}
            onAdditionalGuestsChange={setAdditionalGuests}
            maxAdditionalGuests={selectedEvent?.limitOnePlus}
            inviteMessage={inviteMessage}
            onInviteMessageChange={setInviteMessage}
            guestNote={guestNote}
            onGuestNoteChange={setGuestNote}
            eventName={selectedEvent?.name}
            eventStartDate={selectedEvent?.startDate}
            directlySendToConfirm={directlySendToConfirm}
            onDirectlySendToConfirmChange={setDirectlySendToConfirm}
          />
        </View>
      </ScrollView>
      <View style={styles.actionCtaContainer}>
        {!isManual ? (
          <Button
            title={'Add to Drafts'}
            onPress={() => onPressCta(false)}
            style={[styles.actionCta, styles.borderActionCta]}
            loading={isDraftInvite && inviteGuestsLoading}
          />
        ) : null}
        <Button
          title={
            isManual ? 'Send Invite' : `Send ${selectedUsers.length} Invites`
          }
          onPress={() => {
            if (isManual) {
              onPressSendManualInvite();
            } else {
              onPressCta(true);
            }
          }}
          colorTheme="dark"
          style={styles.actionCta}
          loading={
            !isDraftInvite && (inviteGuestsLoading || inviteNewGuestsLoading)
          }
        />
      </View>

      <TicketTypeBottomSheet
        ref={actionSheetRef}
        ticketTypes={selectedEvent?.ticketTypes || []}
        selectedTicketType={selectedTicketType}
        setSelectedTicketType={setSelectedTicketType}
      />
    </View>
  );
};

export default ManageGuests;

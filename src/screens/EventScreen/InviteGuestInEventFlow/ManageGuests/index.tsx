import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useCallback, useRef, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import Counter from 'src/component/Counter';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {EventStackParamList} from 'src/navigation/EventStack';
import {RootState} from 'src/redux/slices';
import {COLORS} from 'src/utils/constants';
import {
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import TicketTypeBottomSheet, {TicketType} from '../TicketTypeBottomSheet';
import createStyles from './styles';

interface ManageGuestsProps
  extends NativeStackScreenProps<EventStackParamList, 'ManageGuestsScreen'> {}

const ManageGuests: React.FC<ManageGuestsProps> = ({}) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const ticketTypeRef = useRef<InputRefMethods>(null);
  const inviteMessageRef = useRef<InputRefMethods>(null);
  const guestNoteRef = useRef<InputRefMethods>(null);

  const [isInviteDetailsOpen, setIsInviteDetailsOpen] = useState<boolean>(true);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = useState<number>(0);
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [guestNote, setGuestNote] = useState<string>('');
  const [directlySendToConfirm, setDirectlySendToConfirm] =
    useState<boolean>(false);

  const {selectedUsers, selectedEvent} = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      selectedEvent: state.inviteGuestsFlow.selectedEvent,
    }),
    shallowEqual,
  );

  const validateForm = () => {
    if (!selectedTicketType) {
      ticketTypeRef?.current?.setErrorMessage('Ticket type required');
      return false;
    }
    return true;
  };

  const onAddDraft = () => {
    const formValidated = validateForm();
    if (formValidated) {
    }
  };

  const onSendInvite = () => {
    const formValidated = validateForm();
    if (formValidated) {
    }
  };

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
        rightIconWrapperStyle={{backgroundColor: COLORS.black}}
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
          <CustomText style={styles.title}>
            {`${selectedUsers.length} Recipients`}
          </CustomText>
          <View style={styles.usersAvatarContainer}>
            {slicedSelectedUsers.map((item, index) => {
              return (
                <AvatarInitials
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
        </View>

        <View style={styles.contentWrapper}>
          <View
            style={[
              styles.inviteDetailHeader,
              !isInviteDetailsOpen && {
                borderBottomWidth: 0,
                paddingBottom: 0,
              },
            ]}>
            <CustomText style={styles.title}>{'Invite Details'}</CustomText>
            <TouchableOpacity
              style={styles.accordianArrowContainer}
              onPress={() => setIsInviteDetailsOpen(!isInviteDetailsOpen)}>
              <Image
                source={IMAGES.arrowRight}
                style={{
                  transform: [
                    {rotate: isInviteDetailsOpen ? '270deg' : '90deg'},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>
          {isInviteDetailsOpen ? (
            <View
              style={{
                marginTop: verticalScale(24),
                gap: verticalMarginScale(24),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: horizontalMarginScale(8),
                }}>
                <Input
                  ref={ticketTypeRef}
                  isRequired
                  label="Ticket Type"
                  defaultValue={
                    selectedTicketType?.name || 'Select Ticket Type'
                  }
                  errorMessage=""
                  rightImage={IMAGES.arrowRight}
                  inputFieldContainerStyle={{
                    height: undefined,
                    paddingVertical: verticalMarginScale(12),
                    borderRadius: radiusScale(12),
                  }}
                  otherStyle={{marginTop: 0, flex: 1}}
                  customRightImageStyle={{
                    height: verticalScale(16),
                    width: horizontalScale(16),
                    transform: [{rotate: '90deg'}],
                  }}
                  editable={false}
                  extraInputProps={{
                    onPress: () => {
                      actionSheetRef?.current?.open();
                    },
                  }}
                />

                <View>
                  <CustomText style={styles.label}>
                    {'Additional Guest'}
                  </CustomText>
                  <Counter
                    counterValue={additionalGuests}
                    onPressMinus={() =>
                      setAdditionalGuests(prev => (prev > 0 ? prev - 1 : prev))
                    }
                    onPressPlus={() =>
                      setAdditionalGuests(prev =>
                        selectedEvent
                          ? prev < selectedEvent?.limitOnePlus
                            ? prev + 1
                            : prev
                          : prev,
                      )
                    }
                  />
                </View>
              </View>

              <View>
                <CustomText style={styles.label}>{'Invite Message'}</CustomText>
                <View style={styles.inviteMessageInputContainer}>
                  <CustomText style={styles.inviteMessagePrototype}>
                    {`Hi, you're invited to ${selectedEvent?.name} on ${moment(
                      selectedEvent?.startDate,
                    )
                      .utc()
                      .format('MMM DD, YYYY')} at ${moment(
                      selectedEvent?.startDate,
                    )
                      .utc()
                      .format('hh:mm A')}.`}
                  </CustomText>
                  <View style={styles.seperator} />
                  <Input
                    ref={inviteMessageRef}
                    defaultValue={inviteMessage}
                    errorMessage=""
                    placeholder="Add your optional message..."
                    multiline
                    inputFieldContainerStyle={{borderWidth: 0}}
                    otherStyle={{marginTop: 0}}
                    onChangeText={setInviteMessage}
                  />
                </View>
              </View>

              <Input
                ref={guestNoteRef}
                label="Guest Note"
                defaultValue={guestNote}
                errorMessage=""
                placeholder="Add a private note. Not visible to the guest."
                multiline
                inputFieldContainerStyle={{borderRadius: radiusScale(16)}}
                otherStyle={{marginTop: 0}}
                onChangeText={setGuestNote}
              />

              {directlySendToConfirm ? (
                <View
                  style={[
                    styles.bypassTextContainer,
                    {
                      paddingVertical: verticalMarginScale(8),
                      paddingHorizontal: horizontalMarginScale(8),
                      borderRadius: radiusScale(8),
                    },
                  ]}>
                  <Image
                    source={IMAGES.info}
                    style={styles.bypassInfo}
                    resizeMode="contain"
                  />
                  <CustomText style={{flex: 1}}>
                    {'This guest will be added directly to the confirmed tab'}
                  </CustomText>
                  <Button
                    onPress={() =>
                      setDirectlySendToConfirm(!directlySendToConfirm)
                    }
                    title="Undo"
                    imageSource={IMAGES.corner_up_left}
                    leftImageStyle={{
                      height: verticalScale(16),
                      width: horizontalScale(16),
                    }}
                    buttonType="stripe"
                    style={styles.undoCta}
                  />
                </View>
              ) : (
                <View>
                  <CustomText style={styles.bypassLabel}>
                    {`Want users to bypass registration?`}
                  </CustomText>
                  <TouchableOpacity
                    style={styles.bypassTextContainer}
                    onPress={() =>
                      setDirectlySendToConfirm(!directlySendToConfirm)
                    }>
                    <CustomText style={styles.bypassText}>
                      {`Add guests directly to the confirmed tab`}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.actionCtaContainer}>
        <Button
          title={'Add to Drafts'}
          onPress={onAddDraft}
          style={[styles.actionCta, styles.borderActionCta]}
        />
        <Button
          title={`Send ${selectedUsers.length} Invites`}
          onPress={onSendInvite}
          colorTheme="dark"
          style={styles.actionCta}
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

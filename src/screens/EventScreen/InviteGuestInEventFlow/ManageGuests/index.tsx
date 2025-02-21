import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import InviteDetails from 'src/component/InviteDetails';
import { EventStackParamList } from 'src/navigation/EventStack';
import { RootState } from 'src/redux/slices';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import TicketTypeBottomSheet, { TicketType } from '../TicketTypeBottomSheet';
import createStyles from './styles';

interface ManageGuestsProps
  extends NativeStackScreenProps<EventStackParamList, 'ManageGuestsScreen'> {}

const ManageGuests: React.FC<ManageGuestsProps> = ({}) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const actionSheetRef = useRef<BottomSheetMethods>(null);

  const { selectedUsers, selectedEvent } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      selectedEvent: state.inviteGuestsFlow.selectedEvent,
    }),
    shallowEqual,
  );

  const [selectedTicketType, setSelectedTicketType] =
    React.useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = React.useState<number>(0);
  const [inviteMessage, setInviteMessage] = React.useState<string>('');
  const [guestNote, setGuestNote] = React.useState<string>('');
  const [directlySendToConfirm, setDirectlySendToConfirm] =
    React.useState<boolean>(false);

  const validateForm = () => {
    if (!selectedTicketType) {
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
        </View>

        <View style={styles.contentWrapper}>
          <InviteDetails
            isCollapsible
            selectedTicketType={selectedTicketType}
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

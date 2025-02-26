import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { COLORS, BUTTON_LABLE, LABLE } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
  horizontalScale,
} from 'src/utils/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IMAGES from '@images/index';
import Button from 'src/component/Button';
import ProfileCard from '../Guest/ProfileCard';
import InviteDetails from '../Guest/InviteGuestDetailForm';
import Questionnaire from '../Guest/Questionnaire';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import TicketTypeBottomSheet, {
  TicketType,
} from '../InviteGuestInEventFlow/TicketTypeBottomSheet';
import DeclineBottomSheet from '../Guest/DeclineBottomSheet';
import { EventGuest } from '../types';
import { useManageGuestMutation } from 'src/redux/actions/eventApiAction';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import {
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,
  useFetchUserDetailsQuery,
} from 'src/redux/actions/usersApiAction';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { ROUTES } from 'src/navigation/Route';

enum GuestStatus {
  DRAFT = 'DRAFT',
  INVITED = 'INVITED',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  APPLIED = 'APPLIED',
  REFUSED = 'REFUSED',
}

interface GuestDetailScreenProps extends NativeStackScreenProps<any, any> {
  guest?: EventGuest;
}

const GuestDetailScreen: React.FC<GuestDetailScreenProps> = ({
  navigation,
  route,
}): JSX.Element => {
  const guest = route.params?.guest as EventGuest;
  const status = guest?.status?.toLowerCase() || 'draft';
  const userId = useSelector((state: RootState) => state.auth.userId);
  const selectedEvent = useSelector(
    (state: RootState) => state.inviteGuestsFlow.selectedEvent,
  );

  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const ticketTypeRef = useRef<any>(null);
  const declineSheetRef = useRef<BottomSheetMethods>(null);

  const [manageGuest] = useManageGuestMutation();
  const [markUserFav] = useMarkUserFavMutation();
  const [unmarkUserFav] = useUnmarkUserFavMutation();
  const { data: userDetails } = useFetchUserDetailsQuery(
    { user: guest?.userId || '' },
    { skip: !guest?.userId },
  );

  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = useState(
    guest?.maxAdditionalGuests,
  );
  const [inviteMessage, setInviteMessage] = useState('');
  const [guestNote, setGuestNote] = useState(guest?.privateGuestNote || '');
  const [directlySendToConfirm, setDirectlySendToConfirm] = useState(false);

  useEffect(() => {
    if (guest?.ticketType && selectedEvent?.ticketTypes) {
      const matchingTicket = selectedEvent.ticketTypes.find(
        (ticket: TicketType) => ticket.name === guest.ticketType,
      );
      if (matchingTicket) {
        setSelectedTicketType(matchingTicket);
      }
    }
  }, [guest?.ticketType, selectedEvent?.ticketTypes]);

  useEffect(() => {
    if (userDetails?.data?.isFavourite !== undefined) {
      setIsFavorite(userDetails.data.isFavourite);
    }
  }, [userDetails?.data?.isFavourite]);

  const handleGuestAction = async (
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    newStatus?: GuestStatus,
  ) => {
    try {
      const payload = {
        status: newStatus,
        guestStatus: newStatus as GuestStatus,
        ticketTypeId: selectedTicketType?.id,
        maxAdditionalGuests: additionalGuests,
        inviteMessage,
        privateGuestNote: guestNote,
        directlySendToConfirm,
      };

      await manageGuest({
        guestId: guest?.id,
        action,
        payload,
      }).unwrap();

      FlashMessageComponent.show(
        'success',
        `${guest.name}'s invite has been updated`,
      );

      navigation.goBack();
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', 'Failed to update guest status');
    }
  };

  const handleFavorite = async () => {
    try {
      if (!userId || !guest?.userId) {
        FlashMessageComponent.show('error', 'Unable to update favorite status');
        return;
      }

      if (isFavorite) {
        await unmarkUserFav({
          user: userId,
          targetUserId: guest.userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Removed from favorites');
      } else {
        await markUserFav({
          user: userId,
          targetUserId: guest.userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      FlashMessageComponent.show('error', 'Failed to update favorite status');
    }
  };

  const handleProfile = () => {
    navigation.navigate(ROUTES.UserDetail, {
      user: guest?.userId,
    });
  };

  const getDeclineSheetProps = () => {
    switch (status) {
      case 'draft':
        return {
          title: 'Remove Guest from Drafts',
          description:
            'Are you sure you want to remove \nselected guests from Drafts?',
          buttonText: 'Remove from Drafts',
        };
      case 'applied':
        return {
          title: 'Delete Request',
          description:
            'Are you sure you want to decline \nselected guests request?',
          buttonText: 'Decline Request',
        };
      case 'confirmed':
        return {
          title: 'Cancel Invite',
          description:
            'Are you sure you want to cancel selected guest invites? \nThey will be notified.',
          buttonText: 'Cancel Invite',
        };
      case 'declined':
        return {
          title: 'Mark as Spam',
          description:
            'Are you sure you want to mark the selected user(s) as spam? \n If they request access to your events in the future, they will automatically be moved to the declined tab. You can manage spam settings at any time from the "Users" tab.',
          buttonText: 'Mark as Spam',
        };
      default:
        return {
          title: 'Withdraw Invite',
          description: 'Are you sure you want to withdraw selected invites?',
          buttonText: 'Withdraw Invite',
        };
    }
  };

  const renderFooterButtons = () => {
    switch (status) {
      case 'draft':
        return (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => declineSheetRef.current?.open()}>
              <Image source={IMAGES.trash} style={styles.trashIcon} />
            </TouchableOpacity>
            <View style={styles.footerButtons}>
              <Button
                style={styles.draftButton}
                title={BUTTON_LABLE.SAVE_DRAFT}
                colorTheme="light"
                onPress={() => handleGuestAction('UPDATE', GuestStatus.DRAFT)}
              />
              <Button
                style={styles.sendButton}
                title={BUTTON_LABLE.SEND_INVITE}
                colorTheme="dark"
                onPress={() =>
                  handleGuestAction(
                    guest?.id ? 'UPDATE' : 'CREATE',
                    GuestStatus.INVITED,
                  )
                }
              />
            </View>
          </>
        );
      case 'applied':
        return (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => declineSheetRef.current?.open()}>
              <Image source={IMAGES.trash} style={styles.trashIcon} />
            </TouchableOpacity>
            <Button
              style={[styles.sendButton]}
              title={BUTTON_LABLE.APPROVE_REQUEST}
              colorTheme="dark"
              onPress={() => handleGuestAction('UPDATE', GuestStatus.CONFIRMED)}
            />
          </>
        );
      case 'declined':
        return (
          <>
            <Button
              style={[styles.sendButton, styles.spamButton]}
              title={BUTTON_LABLE.MARK_AS_SPAM}
              colorTheme="dark"
              onPress={() => declineSheetRef.current?.open()}
            />
          </>
        );
      case 'confirmed':
      case 'invited':
        return (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => declineSheetRef.current?.open()}>
              <Image source={IMAGES.trash} style={styles.trashIcon} />
            </TouchableOpacity>
            <Button
              style={[styles.sendButton]}
              title={BUTTON_LABLE.UPDATE_INVITE}
              colorTheme="dark"
              onPress={() =>
                handleGuestAction('UPDATE', guest?.status as GuestStatus)
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <View style={styles.iconButton}>
            <Image source={IMAGES.leftArrow} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{LABLE.MANAGE_INVITE}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <ProfileCard
            user={{
              name: guest.name,
              avatar: userDetails?.data?.imageUrl || guest.profilePicture,
              roles:
                userDetails?.data?.focuses ||
                guest.category?.map(cat => ({ name: cat, id: cat })) ||
                [],
              age: userDetails?.data?.age || guest.age,
              followers:
                userDetails?.data?.socialStats?.instagramFollowersCount?.toString() ||
                guest.numFollowers?.toString() ||
                '0',
              location: guest.baseCity || userDetails?.data?.city,
              isMember:
                userDetails?.data?.role === 'member' ||
                Boolean(guest.age && guest.baseCity),
              status: userDetails?.data?.status || guest.status,
              interests:
                userDetails?.data?.interest?.split(', ') ||
                guest.interest ||
                [],
              isFollowing: userDetails?.data?.isFollow || false,
            }}
            showGuestStatus={true}
            status={guest?.status}
            actionButtons={[
              {
                title: 'Favorite',
                icon: isFavorite ? IMAGES.star_active : IMAGES.star_inactive,
                onPress: handleFavorite,
              },
              {
                title: 'Profile',
                icon: IMAGES.arrow_up_right,
                onPress: handleProfile,
              },
            ]}
          />
        </View>

        <View style={styles.inviteSection}>
          <InviteDetails
            isCollapsible
            ticketTypeRef={ticketTypeRef}
            selectedTicketType={
              selectedTicketType ||
              (guest?.ticketType
                ? {
                    id: guest.ticketType, // We don't have the ID yet
                    name: guest.ticketType, // But we have the name
                  }
                : undefined)
            }
            onTicketTypePress={() => actionSheetRef?.current?.open()}
            additionalGuests={additionalGuests || 0}
            onAdditionalGuestsChange={setAdditionalGuests}
            inviteMessage={inviteMessage}
            onInviteMessageChange={setInviteMessage}
            guestNote={guestNote}
            onGuestNoteChange={setGuestNote}
            maxAdditionalGuests={selectedEvent?.limitOnePlus}
            eventName={selectedEvent?.name}
            eventStartDate={selectedEvent?.startDate}
            directlySendToConfirm={directlySendToConfirm}
            onDirectlySendToConfirmChange={setDirectlySendToConfirm}
          />

          {Boolean(guest?.questions?.length) && (
            <View style={{ marginTop: verticalMarginScale(16) }}>
              <Questionnaire isCollapsible data={guest?.questions || []} />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderFooterButtons()}</View>

      <TicketTypeBottomSheet
        ref={actionSheetRef}
        ticketTypes={selectedEvent?.ticketTypes || []}
        selectedTicketType={selectedTicketType}
        setSelectedTicketType={setSelectedTicketType}
      />

      <DeclineBottomSheet
        ref={declineSheetRef}
        {...getDeclineSheetProps()}
        onConfirm={() => {
          handleGuestAction('DELETE', GuestStatus.DECLINED);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(20),
    paddingVertical: verticalMarginScale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  iconButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(22),
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalMarginScale(16),
    paddingBottom: verticalMarginScale(20),
  },
  inviteSection: {
    paddingTop: verticalMarginScale(16),
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(8),
    paddingTop: verticalMarginScale(8),
    backgroundColor: COLORS.white,
    gap: horizontalMarginScale(4),
    borderRadius: radiusScale(32),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: verticalScale(-4),
    },
    shadowOpacity: 0.04,
    shadowRadius: radiusScale(9),
    elevation: 4,
    position: 'relative',
    zIndex: 1,
  },
  deleteButton: {
    width: verticalScale(48),
    height: verticalScale(48),
    borderRadius: radiusScale(25),
    backgroundColor: COLORS.errorText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    tintColor: COLORS.white,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: horizontalMarginScale(4),
  },
  draftButton: {
    flex: 1,
    borderRadius: radiusScale(100),
    borderWidth: verticalScale(2),
    borderColor: COLORS.black,
  },
  sendButton: {
    flex: 1,
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.black,
  },
  spamButton: {
    flex: 1,
    backgroundColor: COLORS.errorText,
  },
});

export default GuestDetailScreen;

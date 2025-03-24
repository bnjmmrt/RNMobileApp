import IMAGES from '@images/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { ROUTES } from 'src/navigation/Route';
import {
  useFetchGuestDetailsQuery,
  useManageGuestMutation,
} from 'src/redux/actions/eventApiAction';
import {
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,
} from 'src/redux/actions/usersApiAction';
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
import {
  ApiErrorInterface,
  fontFamily,
  getErrorMessage,
} from 'src/utils/functions';
import AddedBySection from '../Guest/AddedBySection';
import CheckInComponent from '../Guest/CheckInComponent';
import DeclineBottomSheet from '../Guest/DeclineBottomSheet';
import GuestVouches from '../Guest/GuestVouches';
import InviteDetails from '../Guest/InviteGuestDetailForm';
import ProfileCard from '../Guest/ProfileCard';
import Questionnaire from '../Guest/Questionnaire';
import TicketTypeBottomSheet, {
  TicketType,
} from '../InviteGuestInEventFlow/TicketTypeBottomSheet';
import { EventGuest, ManageGuestPayload } from '../types';

enum GuestStatus {
  DRAFT = 'DRAFT',
  INVITED = 'INVITED',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  APPLIED = 'APPLIED',
  REFUSED = 'REFUSED',
}

interface GuestDetailScreenProps extends NativeStackScreenProps<any, any> {
  guestProfile?: EventGuest;
}

const GuestDetailScreen: React.FC<GuestDetailScreenProps> = ({
  navigation,
  route,
}): JSX.Element => {
  const guestId = route.params?.guestId as string;
  const loggedInUserId = useSelector((state: RootState) => state.auth.userId);
  const selectedEvent = useSelector(
    (state: RootState) => state.inviteGuestsFlow.selectedEvent,
  );

  const { data: guestDetails, isLoading: isLoadingGuestDetails } =
    useFetchGuestDetailsQuery(guestId || '', {
      skip: !guestId,
    });

  const guestProfile = guestDetails?.data?.guestProfile;
  const guestDetail = guestDetails?.data?.guestDetail;
  const quizQuestions = guestDetails?.data?.quizDataList;
  const status = guestProfile?.status?.toLowerCase() || 'draft';

  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const ticketTypeRef = useRef<any>(null);
  const declineSheetRef = useRef<BottomSheetMethods>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [manageGuest] = useManageGuestMutation();
  const [markUserFav] = useMarkUserFavMutation();
  const [unmarkUserFav] = useUnmarkUserFavMutation();

  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = useState<number>(0);
  const [inviteMessage, setInviteMessage] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [directlySendToConfirm, setDirectlySendToConfirm] = useState(false);
  const [ticketTypeError, setTicketTypeError] = useState<string>('');

  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState(false);

  useEffect(() => {
    if (guestDetail) {
      setInviteMessage(guestDetail.inviteMessage || '');
      setAdditionalGuests(guestDetail.maxAdditionalGuests || 0);
      setGuestNote(guestDetail.privateGuestNote || '');
    }
  }, [guestDetail]);

  useEffect(() => {
    if (guestDetail?.ticketType && selectedEvent?.ticketTypes) {
      const matchingTicket = selectedEvent.ticketTypes.find(
        (ticket: TicketType) => ticket.name === guestDetail.ticketType,
      );
      if (matchingTicket) {
        setSelectedTicketType(matchingTicket);
      }
    }
  }, [guestDetail?.ticketType, selectedEvent?.ticketTypes]);

  useEffect(() => {
    if (guestProfile?.isFavorite !== undefined) {
      setIsFavorite(guestProfile.isFavorite);
    }
  }, [guestProfile?.favorite]);

  const validateForm = () => {
    if (!selectedTicketType) {
      setTicketTypeError('Ticket type required');
      return false;
    }
    setTicketTypeError('');
    return true;
  };

  const handleGuestAction = async (
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    newStatus?: GuestStatus,
  ) => {
    const formValidated = validateForm();
    if (!formValidated) return;

    try {
      setIsLoadingAction(true);
      const payload: ManageGuestPayload = {
        currentStatus: status as GuestStatus,
        guestStatus: directlySendToConfirm
          ? 'CONFIRMED'
          : (newStatus as GuestStatus),
        ticketTypeId: selectedTicketType?.id,
        maxAdditionalGuests: additionalGuests,
        inviteMessage,
        privateGuestNote: guestNote,
        action,
        exclusiveIds: [],
        inclusiveIds: [guestProfile?.guestId],
        isSelectedAll: false,
        sendNotification: true,
      };

      if (guestProfile?.status === 'CONFIRMED') {
        delete payload.privateGuestNote;
      }

      await manageGuest({
        payload,
        eventId: route?.params?.eventId,
      }).unwrap();

      FlashMessageComponent.show(
        'success',
        `${guestProfile?.name}'s invite has been updated`,
      );

      navigation.goBack();
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setIsLoadingFavorite(true);
      if (!loggedInUserId || !guestProfile?.userId) {
        FlashMessageComponent.show('error', 'Unable to update favorite status');
        return;
      }

      if (isFavorite) {
        await unmarkUserFav({
          user: loggedInUserId,
          targetUserId: guestProfile.userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Removed from favorites');
      } else {
        await markUserFav({
          user: loggedInUserId,
          targetUserId: guestProfile.userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      FlashMessageComponent.show('error', 'Failed to update favorite status');
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleDeclineAction = async () => {
    try {
      setIsLoadingDecline(true);
      await handleGuestAction('DELETE', GuestStatus.INVITED);
    } finally {
      setIsLoadingDecline(false);
    }
  };

  const handleProfile = (id?: string) => {
    navigation.navigate(ROUTES.UserDetail, {
      user: id,
    });
  };

  const onFocusInput = (type: 'inviteMessage' | 'guestNote') => {
    if (scrollRef?.current) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (type === 'guestNote') {
            scrollRef?.current?.scrollTo({
              animated: true,
              y: Dimensions.get('window').height / 1.2,
            });
          }
          if (type === 'inviteMessage') {
            scrollRef?.current?.scrollTo({
              animated: true,
              y: Dimensions.get('window').height / 1.8,
            });
          }
        }, 1000);
      });
    }
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
            'Are you sure you want to cancel this invite? The user will be notified.',
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

  useEffect(() => {
    if (selectedTicketType) {
      setTicketTypeError('');
    }
  }, [selectedTicketType]);

  const renderFooterButtons = () => {
    switch (status) {
      case 'draft':
        return (
          <>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isLoadingDecline && styles.disabledButton,
              ]}
              onPress={() => declineSheetRef.current?.open()}
              disabled={isLoadingDecline}>
              <Image
                source={IMAGES.trash}
                style={[
                  styles.trashIcon,
                  isLoadingDecline && styles.disabledIcon,
                ]}
              />
            </TouchableOpacity>
            <View style={styles.footerButtons}>
              <Button
                style={styles.draftButton}
                title={BUTTON_LABLE.SAVE_DRAFT}
                colorTheme="light"
                onPress={() => handleGuestAction('UPDATE', GuestStatus.DRAFT)}
                loading={isLoadingAction}
              />
              <Button
                style={styles.sendButton}
                title={BUTTON_LABLE.SEND_INVITE}
                colorTheme="dark"
                onPress={() =>
                  handleGuestAction(
                    guestProfile?.id ? 'UPDATE' : 'CREATE',
                    GuestStatus.INVITED,
                  )
                }
                loading={isLoadingAction}
              />
            </View>
          </>
        );
      case 'applied':
        return (
          <>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isLoadingDecline && styles.disabledButton,
              ]}
              onPress={() => declineSheetRef.current?.open()}
              disabled={isLoadingDecline}>
              <Image
                source={IMAGES.trash}
                style={[
                  styles.trashIcon,
                  isLoadingDecline && styles.disabledIcon,
                ]}
              />
            </TouchableOpacity>
            <Button
              style={[styles.sendButton]}
              title={BUTTON_LABLE.APPROVE_REQUEST}
              colorTheme="dark"
              onPress={() => handleGuestAction('UPDATE', GuestStatus.CONFIRMED)}
              loading={isLoadingAction}
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
              loading={isLoadingAction}
            />
          </>
        );
      case 'confirmed':
      case 'invited':
        return (
          <>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isLoadingDecline && styles.disabledButton,
              ]}
              onPress={() => declineSheetRef.current?.open()}
              disabled={isLoadingDecline}>
              <Image
                source={IMAGES.trash}
                style={[
                  styles.trashIcon,
                  isLoadingDecline && styles.disabledIcon,
                ]}
              />
            </TouchableOpacity>
            <Button
              style={[styles.sendButton]}
              title={BUTTON_LABLE.UPDATE_INVITE}
              colorTheme="dark"
              onPress={() =>
                handleGuestAction('UPDATE', guestProfile?.status as GuestStatus)
              }
              loading={isLoadingAction}
            />
          </>
        );
      default:
        return null;
    }
  };

  const mapQuestionsWithAnswers = () => {
    if (
      !quizQuestions?.questions
    ) {
      return [];
    }

    return quizQuestions?.questions.map((question: any) => {

      return {
        ...question,
        answer: question?.answer || '',
      };
    });
  };

  if (isLoadingGuestDetails || !guestProfile) {
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
        <View style={[styles.scrollContent, styles.loaderContainer]}>
          <ActivityIndicator color={COLORS.black} />
        </View>
      </SafeAreaView>
    );
  }

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          ref={scrollRef}>
          <View>
            <ProfileCard
              user={{
                name: guestProfile.name,
                avatar: guestProfile.profilePicture,
                roles:
                  guestProfile.category?.map((cat: string) => ({
                    name: cat,
                    id: cat,
                  })) || [],
                age: guestProfile.age,
                followers: guestProfile.numFollowers?.toString() || '0',
                location: guestProfile.address?.address || '.',
                isMember: guestProfile.roles?.some(
                  (role: any) => role.roleName === 'member',
                ),
                status: guestProfile.status,
                isFollowing: guestProfile.isFollow,
              }}
              showGuestStatus={true}
              status={guestProfile.status}
              actionButtons={[
                {
                  title: 'Favorite',
                  icon: isFavorite ? IMAGES.star_active : IMAGES.star_inactive,
                  onPress: handleFavorite,
                  loading: isLoadingFavorite,
                },
                {
                  title: 'Profile',
                  icon: IMAGES.arrow_up_right,
                  onPress: () => handleProfile(guestProfile?.userId),
                  loading: false,
                },
              ]}
            />

            {guestProfile.addedBy && (
              <AddedBySection
                user={{
                  name: guestProfile.addedBy || '',
                  id: guestProfile.addedById || '',
                  avatar: guestProfile.addedByPicture || '',
                }}
              />
            )}

            {Boolean(guestDetails?.data.vouches.length > 0) && (
              <GuestVouches
                requestSource="In-App"
                vouches={guestDetails?.data.vouches}
              />
            )}
          </View>

          <View style={styles.inviteSection}>
            <InviteDetails
              isCollapsible
              ticketTypeError={ticketTypeError}
              selectedTicketType={selectedTicketType}
              onTicketTypePress={() => actionSheetRef?.current?.open()}
              additionalGuests={additionalGuests}
              onAdditionalGuestsChange={setAdditionalGuests}
              inviteMessage={inviteMessage}
              onInviteMessageChange={setInviteMessage}
              guestNote={guestNote}
              onGuestNoteChange={setGuestNote}
              maxAdditionalGuests={guestDetail.maxAdditionalGuests || 0}
              eventName={selectedEvent?.name}
              eventStartDate={selectedEvent?.startDate}
              directlySendToConfirm={directlySendToConfirm}
              onDirectlySendToConfirmChange={setDirectlySendToConfirm}
              status={guestProfile.status}
              onFocusGuestNote={() => {
                onFocusInput('guestNote');
              }}
              onFocusInviteMessage={() => {
                onFocusInput('inviteMessage');
              }}
            />

            {Boolean(quizQuestions?.questions?.length) && (
              <View style={{ marginTop: verticalMarginScale(16) }}>
                <Questionnaire isCollapsible data={mapQuestionsWithAnswers()} />
              </View>
            )}
          </View>
          {guestProfile?.status === GuestStatus.CONFIRMED && (
            <CheckInComponent
              status={guestProfile?.status}
              guestProfile={guestProfile}
              ticketType={guestProfile?.guestDetail?.ticketType}
              privateGuestNote={guestDetail?.privateGuestNote}
              additionalGuests={guestProfile?.additionalGuests}
              maxAdditionalGuests={guestDetail?.maxAdditionalGuests}
              selectedTicketType={selectedTicketType}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
        onConfirm={handleDeclineAction}
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
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(8),
    paddingTop: verticalMarginScale(8),
    backgroundColor: COLORS.white,
    gap: horizontalMarginScale(4),
    borderTopLeftRadius: radiusScale(32),
    borderTopRightRadius: radiusScale(32),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: verticalScale(-4),
    },
    shadowOpacity: 0.04,
    shadowRadius: radiusScale(9),
    elevation: 10,
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
  addedByWrapper: {
    marginTop: verticalMarginScale(-8),
    marginBottom: verticalMarginScale(8),
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: radiusScale(8),
    borderBottomRightRadius: radiusScale(8),
    borderColor: COLORS.neutralBorder,
    borderWidth: verticalScale(1),
    borderTopWidth: 0,
    paddingVertical: verticalMarginScale(8),
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledIcon: {
    opacity: 0.7,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GuestDetailScreen;

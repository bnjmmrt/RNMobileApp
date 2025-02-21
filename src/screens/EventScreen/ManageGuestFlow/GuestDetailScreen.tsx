import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, BUTTON_LABLE } from 'src/utils/constants';
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

interface GuestDetailScreenProps extends NativeStackScreenProps<any, any> {}

const GuestDetailScreen: React.FC<GuestDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const guest = route.params?.guest;
  const status = guest?.status?.toLowerCase() || 'drafts';

  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const declineSheetRef = useRef<BottomSheetMethods>(null);

  const [selectedTicketType, setSelectedTicketType] =
    React.useState<TicketType>();
  const [additionalGuests, setAdditionalGuests] = React.useState(0);
  const [inviteMessage, setInviteMessage] = React.useState('');
  const [guestNote, setGuestNote] = React.useState('');
  const [directlySendToConfirm, setDirectlySendToConfirm] =
    React.useState(false);

  // Mock ticket types data
  const mockTicketTypes: TicketType[] = [
    {
      id: '1',
      name: 'Standard',
      capacity: 100,
      description: 'Standard ticket type',
      enabled: true,
    },
    {
      id: '2',
      name: 'VIP',
      capacity: 50,
      description: 'VIP ticket type with premium benefits',
      enabled: true,
    },
    {
      id: '3',
      name: 'Premium',
      capacity: 25,
      description: 'Premium ticket type with exclusive access',
      enabled: true,
    },
  ];

  const handleFavorite = () => {
    // Handle favorite action
  };

  const handleProfile = () => {
    // Handle profile action
  };

  const getDeclineSheetProps = () => {
    switch (status) {
      case 'drafts':
        return {
          title: 'Remove Guest from Drafts',
          description:
            'Are you sure you want to remove \nselected guests from Drafts?',
          buttonText: 'Remove from Drafts',
        };
      case 'requested':
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

  const handleDelete = () => {
    // Handle delete action here
    console.log('Deleting guest:', guest);
  };

  const renderFooterButtons = () => {
    switch (status) {
      case 'drafts':
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
                onPress={() => {}}
              />
              <Button
                style={styles.sendButton}
                title={BUTTON_LABLE.SEND_INVITE}
                colorTheme="dark"
                onPress={() => {}}
              />
            </View>
          </>
        );
      case 'requested':
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
              onPress={() => {}}
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
              onPress={() => {}}
            />
          </>
        );
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
              onPress={() => {}}
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.iconButton}>
            <Image source={IMAGES.leftArrow} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Invite</Text>
        <TouchableOpacity>
          <View style={styles.iconButton}>
            <Image source={IMAGES.qr} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <ProfileCard
            guest={{
              name: guest?.name || '',
              avatar: guest?.avatar,
              roles: guest?.roles || [],
              age: guest?.age,
              followers: guest?.followers,
              location: guest?.location,
              isMember: guest?.isMember,
              status: guest?.status,
            }}
            actionButtons={[
              {
                title: 'Favorite',
                icon: IMAGES.star_inactive,
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
            selectedTicketType={selectedTicketType}
            onTicketTypePress={() => actionSheetRef?.current?.open()}
            additionalGuests={additionalGuests}
            onAdditionalGuestsChange={setAdditionalGuests}
            maxAdditionalGuests={5}
            inviteMessage={inviteMessage}
            onInviteMessageChange={setInviteMessage}
            guestNote={guestNote}
            onGuestNoteChange={setGuestNote}
            directlySendToConfirm={directlySendToConfirm}
            onDirectlySendToConfirmChange={setDirectlySendToConfirm}
          />
          <View style={{ marginTop: verticalMarginScale(16) }}>
            <Questionnaire
              isCollapsible
              data={
                guest?.questionnaire || [
                  {
                    question:
                      'Have you attended one of our events in the past?',
                    answer: "Yes! Last year's Super Bowl party in Arizona",
                  },
                  {
                    question:
                      'Any guest references that are currently members?',
                    answer: 'Close friends - Olivia Culpo, Arielle Charnas',
                  },
                  {
                    question: 'What interests you most about this event?',
                    answer:
                      'The networking opportunities and creative collaborations',
                  },
                  {
                    question:
                      'Do you have any dietary restrictions or preferences?',
                    answer: 'No specific requirements',
                  },
                  {
                    question:
                      'Would you be interested in contributing to the event (e.g., performing, speaking)?',
                    answer:
                      'Yes, would love to share my experience in the industry',
                  },
                ]
              }
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderFooterButtons()}</View>

      <TicketTypeBottomSheet
        ref={actionSheetRef}
        ticketTypes={mockTicketTypes}
        selectedTicketType={selectedTicketType}
        setSelectedTicketType={setSelectedTicketType}
      />

      <DeclineBottomSheet
        ref={declineSheetRef}
        {...getDeclineSheetProps()}
        onConfirm={handleDelete}
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
  },
  iconButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(22),
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
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

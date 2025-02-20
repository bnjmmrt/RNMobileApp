import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, BUTTON_LABLE } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import { fontScale } from 'src/utils/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from 'src/assets/images';
import Button from 'src/component/Button';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';

interface GuestDetailScreenProps extends NativeStackScreenProps<any, any> {}

const GuestDetailScreen: React.FC<GuestDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const guest = route.params?.guest;
  const status = guest?.status?.toLowerCase() || 'drafts';

  const renderFooterButtons = () => {
    switch (status) {
      case 'drafts':
        return (
          <>
            <TouchableOpacity style={styles.deleteButton}>
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
            <TouchableOpacity style={styles.deleteButton}>
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
              onPress={() => {}}
            />
          </>
        );
      case 'confirmed':
        return (
          <>
            <TouchableOpacity style={styles.deleteButton}>
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
            <TouchableOpacity style={styles.deleteButton}>
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

  console.log('guest', guest);

  return (
    <View style={styles.container}>
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
        <View style={styles.guestCard}>
          <View style={styles.guestCardHeader}>
            <View>
              <StatusLabel status={guest?.status || 'Drafts'} />
            </View>

            <View style={styles.userCheckContainer}>
              <Image source={IMAGES.user_check} style={styles.userCheckIcon} />
            </View>
          </View>

          <View style={styles.guestCardContent}>
            <View>
              <FastImage
                source={{
                  uri:
                    guest?.avatar ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(guest?.name || ''),
                }}
                style={styles.guestAvatar}
              />
              <View style={styles.memberBadgeContainer}>
                <Image
                  source={IMAGES.check_verified}
                  style={styles.memberBadgeIcon}
                />
                <Text style={styles.memberBadgeText}>Member</Text>
              </View>
            </View>
            <Text style={styles.name}>{guest?.name}</Text>
            <View style={styles.roleContainer}>
              {guest?.roles?.map((role: string, index: number) => (
                <View key={index} style={styles.role}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, styles.leftStatItem]}>
                <Image source={IMAGES.hourglass} style={styles.statIcon} />
                <Text style={styles.statText}>{guest?.age} Years Old</Text>
              </View>
              <View style={[styles.statItem, styles.centerStatItem]}>
                <Image source={IMAGES.user_check} style={styles.statIcon} />
                <Text style={styles.statText}>
                  {(guest?.followers / 1000000).toFixed(1)}M
                </Text>
              </View>
              <View style={[styles.statItem, styles.rightStatItem]}>
                <Image source={IMAGES.location} style={styles.statIcon} />
                <Text style={styles.statText}>{guest?.location}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Invite Details</Text>
          <View style={styles.inviteDetail}>
            <Text style={styles.detailLabel}>Ticket Type</Text>
            <TouchableOpacity style={styles.ticketSelector}>
              <Text style={styles.ticketText}>Standard</Text>
              <Image source={IMAGES.downArrow} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.inviteDetail}>
            <Text style={styles.detailLabel}>Additional Guest</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>0</Text>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Invite Message</Text>
            <Text style={styles.messageText}>
              Hi, you're invited to [Event Name] on [MON DD, YYYY at T:TT PM].
            </Text>
            <Text style={styles.messagePlaceholder}>
              Add your optional message...
            </Text>
          </View>
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Guest Note</Text>
            <Text style={styles.notePlaceholder}>
              Add a private note. Not visible to the guest.
            </Text>
          </View>
          <View style={styles.bypassContainer}>
            <Text style={styles.bypassTitle}>
              Want users to bypass registration?
            </Text>
            <TouchableOpacity style={styles.bypassButton}>
              <Text style={styles.bypassButtonText}>
                Add guests directly to the confirmed tab
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderFooterButtons()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  guestCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.neutralBorder,
  },
  guestCardHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 8,
  },
  userCheckContainer: {
    width: 48,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  userCheckIcon: {
    width: 16,
    height: 16,
  },
  guestCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  memberBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingRight: 8,
    paddingLeft: 6,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -18,
  },
  memberBadgeIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
    tintColor: COLORS.surfaceSecondary,
  },
  memberBadgeText: {
    color: COLORS.white,
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  name: {
    fontSize: fontScale(24),
    // lineHeight: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  role: {
    fontSize: fontScale(12),
    color: COLORS.black,
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 128,
  },
  roleText: {
    fontSize: fontScale(12),
    color: COLORS.black,
    fontWeight: '500',
  },

  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  centerStatItem: {
    flex: 0,
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  leftStatItem: {
    flex: 1,
  },
  rightStatItem: {
    flex: 1,
  },
  statIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.surfaceSecondary,
  },
  statText: {
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  actionButtonText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  inviteSection: {
    paddingTop: 24,
    gap: 24,
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
  },
  inviteDetail: {
    gap: 8,
  },
  detailLabel: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  ticketSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
  },
  ticketText: {
    fontSize: fontScale(14),
    color: COLORS.black,
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lighter_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: fontScale(20),
    color: COLORS.black,
  },
  counterText: {
    fontSize: fontScale(16),
    color: COLORS.black,
  },
  messageContainer: {
    gap: 8,
  },
  messageLabel: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  messageText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    backgroundColor: COLORS.lighter_gray,
    padding: 16,
    borderRadius: 8,
  },
  messagePlaceholder: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  noteContainer: {
    gap: 8,
  },
  noteLabel: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  notePlaceholder: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  bypassContainer: {
    gap: 8,
    marginBottom: 24,
  },
  bypassTitle: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  bypassButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  bypassButtonText: {
    fontSize: fontScale(14),
    color: COLORS.blueDark,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    gap: 12,
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.bgRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.errorText,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    borderRadius: 100,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  sendButton: {
    flex: 1,
    borderRadius: 100,
    height: 50,
    backgroundColor: COLORS.black,
  },
  spamButton: {
    flex: 1,
    backgroundColor: COLORS.errorText,
  },
});

export default GuestDetailScreen;

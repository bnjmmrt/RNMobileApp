import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
  horizontalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import IMAGES from 'src/assets/images';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';
import AvatarInitials from 'src/component/AvatarInitials';

interface User {
  name: string;
  avatar?: string;
  roles?: Array<{
    name: string;
    id: string;
  }>;
  age?: number;
  followers?: string;
  location?: string;
  isMember?: boolean;
  status?: string;
  interests?: string[];
  isFollowing?: boolean;
}

interface ActionButton {
  title: string;
  icon: any;
  onPress: () => void;
  otherStyle?: any;
  loading?: boolean;
}

interface ProfileCardProps {
  user?: User;
  actionButtons: ActionButton[];
  showGuestStatus?: boolean;
  status?: string;
}

const MemberBadge = () => (
  <View style={styles.memberBadge}>
    <Image source={IMAGES.check_verified} style={styles.memberBadgeIcon} />
    <Text style={styles.memberBadgeText}>Member</Text>
  </View>
);

const NonMemberBadge = () => (
  <View style={styles.nonMemberBadge}>
    <Text style={styles.nonMemberBadgeText}>Non-Member</Text>
  </View>
);

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  actionButtons = [],
  showGuestStatus = true,
  status = 'DRAFT',
}) => {
  return (
    <>
      <View style={styles.guestCard}>
        <View style={styles.guestCardHeader}>
          <View>
            {showGuestStatus ? <StatusLabel status={status} /> : null}
          </View>

          {user?.isFollowing ? (
            <View style={styles.followIndicator}>
              <Image source={IMAGES.user_check} style={styles.followIcon} />
            </View>
          ) : null}
        </View>
        <View style={styles.guestCardContent}>
          <View style={styles.profileImageContainer}>
            <AvatarInitials
              name={user?.name || ''}
              imgUrl={user?.avatar}
              size={80}
            />
            {user?.isMember ? <MemberBadge /> : <NonMemberBadge />}
          </View>
          <Text style={styles.name}>{user?.name}</Text>

          {user?.isMember && (
            <>
              <View style={styles.roleContainer}>
                {user?.roles?.map((role, index) => (
                  <View key={index} style={styles.role}>
                    <Text style={styles.roleText}>{role.name}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statsContainer}>
                <View style={[styles.statItem, styles.leftStatItem]}>
                  <Image source={IMAGES.hourglass} style={styles.statIcon} />
                  <Text style={styles.statText}>
                    {user?.age || 'N/A'} Years Old
                  </Text>
                </View>
                <View style={[styles.statItem, styles.centerStatItem]}>
                  <Image source={IMAGES.user_check} style={styles.statIcon} />
                  <Text style={styles.statText}>{user?.followers || '0'}</Text>
                </View>
                <View style={[styles.statItem, styles.rightStatItem]}>
                  <Image source={IMAGES.location} style={styles.statIcon} />
                  <Text
                    style={styles.statText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {user?.location || 'N/A'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.actionButtons}>
        {actionButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, button.otherStyle]}
            onPress={button.onPress}
            disabled={button.loading}>
            <Image source={button.icon} style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  guestCardHeader: {
    paddingLeft: horizontalMarginScale(16),
    paddingRight: horizontalMarginScale(8),
    paddingTop: verticalMarginScale(8),
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  followIndicator: {
    width: verticalScale(48),
    height: verticalScale(40),
    borderRadius: radiusScale(22),
    justifyContent: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    alignItems: 'center',
  },
  followIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  guestCard: {
    backgroundColor: COLORS.white,
    borderWidth: verticalScale(1),
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
    borderBottomLeftRadius: radiusScale(8),
    borderBottomRightRadius: radiusScale(8),
    overflow: 'hidden',
    borderColor: COLORS.neutralBorder,
  },
  guestCardContent: {
    alignItems: 'center',
    padding: horizontalMarginScale(16),
  },
  guestAvatar: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: radiusScale(40),
    backgroundColor: COLORS.lighter_gray,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingRight: horizontalMarginScale(8),
    paddingLeft: horizontalMarginScale(6),
    paddingVertical: verticalMarginScale(4),
    borderRadius: radiusScale(12),
    marginTop: verticalMarginScale(-18),
  },
  memberBadgeIcon: {
    width: horizontalScale(12),
    height: verticalScale(12),
    marginRight: horizontalMarginScale(4),
    tintColor: COLORS.surfaceSecondary,
  },
  memberBadgeText: {
    color: COLORS.white,
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  nonMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(4),
    borderRadius: radiusScale(12),
    marginTop: verticalMarginScale(-18),
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
  },
  nonMemberBadgeText: {
    color: COLORS.black,
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  name: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginTop: verticalMarginScale(8),
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalMarginScale(16),
    gap: horizontalMarginScale(4),
  },
  role: {
    fontSize: fontScale(12),
    color: COLORS.black,
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(4),
    borderRadius: radiusScale(128),
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
    marginTop: verticalMarginScale(16),
    justifyContent: 'space-evenly',
    paddingHorizontal: horizontalMarginScale(20),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(4),
    paddingVertical: verticalMarginScale(4),
  },
  centerStatItem: {
    flex: 0,
    minWidth: horizontalScale(100),
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: horizontalMarginScale(20),
  },
  leftStatItem: {
    flex: 1,
  },
  rightStatItem: {
    flex: 1,
  },
  statIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    tintColor: COLORS.surfaceSecondary,
  },
  statText: {
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: horizontalMarginScale(2),
    marginTop: verticalMarginScale(2),
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(8),
    borderTopLeftRadius: radiusScale(8),
    borderTopRightRadius: radiusScale(8),
    borderBottomLeftRadius: radiusScale(16),
    borderBottomRightRadius: radiusScale(16),
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
    color: COLORS.black,
    fontWeight: '500',
  },
  actionButtonIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
});

export default ProfileCard;

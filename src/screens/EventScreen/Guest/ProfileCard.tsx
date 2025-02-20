import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { COLORS } from 'src/utils/constants';
import { fontScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import IMAGES from 'src/assets/images';
import AvatarInitials from 'src/component/AvatarInitials';

interface ActionButton {
  title: string;
  icon: any;
  onPress: () => void;
}

interface ProfileCardProps {
  guest: {
    name: string;
    avatar?: string;
    roles?: string[];
    age?: number;
    followers?: number;
    location?: string;
    isMember?: boolean;
  };
  actionButtons: ActionButton[];
}

const ProfileImage = ({
  name,
  avatar,
  isMember,
}: {
  name: string;
  avatar?: string;
  isMember?: boolean;
}) => {
  if (isMember) {
    return (
      <FastImage
        source={{
          uri:
            avatar ||
            'https://ui-avatars.com/api/?name=' +
              encodeURIComponent(name || ''),
        }}
        style={styles.guestAvatar}
      />
    );
  }
  return (
    <View style={styles.guestAvatar}>
      <AvatarInitials name={name} size={80} />
    </View>
  );
};

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

const ProfileCard: React.FC<ProfileCardProps> = ({ guest, actionButtons }) => {
  return (
    <>
      <View style={styles.guestCard}>
        <View style={styles.guestCardContent}>
          <View style={styles.profileImageContainer}>
            <ProfileImage
              name={guest.name}
              avatar={guest.avatar}
              isMember={guest.isMember}
            />
            {guest.isMember ? <MemberBadge /> : <NonMemberBadge />}
          </View>
          <Text style={styles.name}>{guest?.name}</Text>

          {guest.isMember && (
            <>
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
                    {((guest?.followers || 0) / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View style={[styles.statItem, styles.rightStatItem]}>
                  <Image source={IMAGES.location} style={styles.statIcon} />
                  <Text style={styles.statText}>{guest?.location}</Text>
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
            style={styles.actionButton}
            onPress={button.onPress}>
            <Image source={button.icon} style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  guestCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  nonMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -18,
    borderWidth: 1,
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
    gap: 2,
    marginTop: 2,
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    gap: 4,
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
  actionButtonIcon: {
    width: 16,
    height: 16,
  },
});

export default ProfileCard;

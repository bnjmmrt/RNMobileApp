import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
  horizontalScale,
} from 'src/utils/dimensions';
import { fontFamily, formatRole } from 'src/utils/functions';
import IMAGES from 'src/assets/images';
import AvatarInitials from 'src/component/AvatarInitials';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';

interface ActionButton {
  title: string;
  icon: any;
  onPress: () => void;
}
interface Role {
  roleId: string,
  roleName: string,
  status: string,
}

interface ProfileCardProps {
  guest: {
    name: string;
    avatar?: string;
    roles?: Role[];
    age: number;
    followers?: string;
    location?: string;
    isMember?: boolean;
    status?: string;
    interests?:string[]
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

const MemberBadge = ({role}) => (
  <View style={styles.memberBadge}>
    <Image source={IMAGES.check_verified} style={styles.memberBadgeIcon} />
    <Text style={styles.memberBadgeText}>{formatRole(role)}</Text>
  </View>
);

const NonMemberBadge = () => (
  <View style={styles.nonMemberBadge}>
    <Text style={styles.nonMemberBadgeText}>Non-Member</Text>
  </View>
);

const ProfileCard: React.FC<ProfileCardProps> = ({ guest, actionButtons=[] }) => {
 console.log("ismember",guest.interests)
  return (
    <>
      <View style={styles.guestCard}>
        <View style={styles.guestCardHeader}>
          <View>
            <StatusLabel status={guest?.status || 'Drafts'} />
          </View>
          <View style={styles.followIndicator}>
            <Image source={IMAGES.user_check} style={styles.followIcon} />
          </View>
        </View>
        <View style={styles.guestCardContent}>
          <View style={styles.profileImageContainer}>
            <ProfileImage
              name={guest.name}
              avatar={guest.avatar}
              isMember={guest.isMember}
            />
            {guest.isMember ? <MemberBadge role={guest?.roles[0].roleName} /> : <NonMemberBadge />}
          </View>
          <Text style={styles.name}>{guest?.name}</Text>

          {guest.isMember && (
            <>
              <View style={styles.roleContainer}>
                {guest?.interests?.map((interest: string, index: number) => (
                  <View key={index} style={styles.role}>
                    <Text style={styles.roleText}>{interest}</Text>
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
                    {guest?.followers}
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
  guestCardHeader: {
    paddingLeft: horizontalMarginScale(16),
    paddingRight: horizontalMarginScale(8),
    paddingTop: verticalMarginScale(8),
    // marginBottom: verticalMarginScale(-40),
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
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
    borderBottomLeftRadius: radiusScale(8),
    borderBottomRightRadius: radiusScale(8),
    overflow: 'hidden',
    borderWidth: verticalScale(1),
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

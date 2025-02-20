import IMAGES from '@images/index';
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import {COLORS} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

const ProfileCard = () => {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <AvatarInitials  name="Anurag Harod" size={80} />
          <View style={styles.memberBadge}>
            <Image source={IMAGES.check_verified} />
            <Text style={styles.memberText}>Member</Text>
          </View>
        </View>

        <Text style={styles.name}>Anurag Harod</Text>

        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Actor</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Content Creator</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Model</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailText}>
            <Image source={IMAGES.check_verified} />
            <Text> 21 Years Old</Text>
          </View>
          <View style={styles.detailText}>
            <Image source={IMAGES.check_verified} />
            <Text> 25.7M</Text>
          </View>
          <View style={styles.detailText}>
            <Image source={IMAGES.check_verified} />
            <Text> Los Angeles</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.grayCard]}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.checkedInButton}>
            <Image source={IMAGES.checkCircleFilled} />
            <Text style={styles.checkedInText}> Checked-In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={IMAGES.arrowRight} />
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
    borderBottomLeftRadius: radiusScale(8),
    borderBottomRightRadius: radiusScale(8),
    padding: verticalMarginScale(16),
    alignItems: 'center',
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // shadowOffset: {width: 0, height: 5},
    // elevation: 5,
    marginVertical: 2,
  },
  grayCard: {
    backgroundColor: COLORS.lighter_gray,
    borderWidth: 0,
    borderBottomLeftRadius: radiusScale(16),
    borderBottomRightRadius: radiusScale(16),
    padding:verticalMarginScale(8)
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -5,
    backgroundColor: 'black',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radiusScale(25),
  },
  memberText: {
    color: COLORS.white,
    fontSize: fontScale(12),
    fontWeight: '500',
    marginLeft: 5,
  },
  name: {
    fontSize: fontScale(24),
    fontWeight: '700',
    marginVertical: verticalMarginScale(12),
    lineHeight: 32,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  tag: {
    backgroundColor: COLORS.borderGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radiusScale(25),
    marginHorizontal: 3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 10,
  },
  detailText: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  checkedInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderColor: COLORS.borderBlue,
    borderWidth: 1,
    borderRadius: radiusScale(25),
    width: '65%',
    alignItems: 'center',
  },
  checkedInText: {
    color: COLORS.black,
    fontWeight: '500',
    fontSize: fontScale(14),
  },
  profileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    borderRadius: radiusScale(25),
    width: '32%',
    alignItems: 'center',
  },
  profileText: {
    color: COLORS.black,
    fontWeight: '500',
    fontSize: fontScale(14),
  },
});

export default ProfileCard;

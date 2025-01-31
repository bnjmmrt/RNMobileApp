import IMAGES from '@images/index';
import React from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = ({}) => {
  const styles = createStyle();

  return (
    <>
      <UserDetailCard
        containerStyle={{
          borderBottomLeftRadius: radiusScale(8),
          borderBottomRightRadius: radiusScale(8),
          borderTopLeftRadius: radiusScale(16),
          borderTopRightRadius: radiusScale(16),
        }}>
        <View style={{alignItems: 'center'}}>
          <AvatarInitials
            name="Jennh Wilson"
            size={80}
            imgUrl="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2532"
          />
          <View style={styles.memberTypeWrapper}>
            <CustomText style={styles.memberType}>{'Non-Member'}</CustomText>
          </View>
          <CustomText style={styles.userName}>{'Jenny Wilson'}</CustomText>
          <ScrollView
            contentContainerStyle={{
              gap: horizontalMarginScale(4),
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: verticalMarginScale(16),
              justifyContent: 'center',
            }}
            scrollEnabled={false}>
            {[1, 1, 1, 1, 1].map((item, index) => {
              return (
                <View style={styles.userTagsContainer}>
                  <CustomText style={styles.userTags}>{'Actor'}</CustomText>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.userActionsFloatingContainer}>
          <TouchableOpacity style={styles.userActionButton}>
            <Image source={IMAGES.alert_triangle_filled} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userActionButton}>
            <Image source={IMAGES.user_check} />
          </TouchableOpacity>
        </View>
      </UserDetailCard>
      <View style={styles.favButtonWrapper}>
        <Button
          title={'Favorite'}
          imageSource={IMAGES.start_active}
          leftImageStyle={{height: verticalScale(16), width: verticalScale(16)}}
          style={styles.favButton}
          onPress={() => {}}
        />
      </View>
    </>
  );
};

export default UserProfile;

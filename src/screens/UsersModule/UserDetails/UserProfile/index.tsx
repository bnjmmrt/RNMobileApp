import IMAGES from '@images/index';
import React from 'react';
import {View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = ({}) => {
  const styles = createStyle();

  return (
    <>
      <UserDetailCard>
        <View style={{alignItems: 'center'}}>
          <AvatarInitials name="Jennh Wilson" size={80} />
          <View style={styles.memberTypeWrapper}>
            <CustomText style={styles.memberType}>{'Non-Member'}</CustomText>
          </View>
          <CustomText style={styles.userName}>{'Jenny Wilson'}</CustomText>
        </View>
      </UserDetailCard>
      <View style={styles.favButtonWrapper}>
        <Button
          title={'Favorite'}
          imageSource={IMAGES.start_active}
          leftImageStyle={{height: 16, width: 16}}
          style={styles.favButton}
          onPress={() => {}}
        />
      </View>
    </>
  );
};

export default UserProfile;

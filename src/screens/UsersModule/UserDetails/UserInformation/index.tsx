import IMAGES from '@images/index';
import React from 'react';
import {TextInput} from 'react-native';
import ButtonSmall from 'src/component/ButtonSmall';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserInformationProps {}

const UserInformation: React.FC<UserInformationProps> = ({}) => {
  const styles = createStyle();

  return (
    <UserDetailCard title={'Information'}>
      <CustomText style={styles.inputLabel}>{'User Note'}</CustomText>
      <TextInput
        style={styles.input}
        placeholder="These notes are internal and only visible to you"
        verticalAlign="top"
        multiline
      />
      <ButtonSmall
        colorTheme="dark"
        style={{
          padding: 12,
          borderRadius: 99,
          alignSelf: 'flex-start',
          marginTop: 8,
        }}
        title="Save"
        onPress={() => {}}
        leftIcon={IMAGES.check}
        leftIconStyle={{tintColor: 'white'}}
      />
    </UserDetailCard>
  );
};

export default UserInformation;

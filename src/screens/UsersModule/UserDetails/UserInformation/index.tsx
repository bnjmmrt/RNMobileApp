import IMAGES from '@images/index';
import React from 'react';
import ButtonSmall from 'src/component/ButtonSmall';
import Input from 'src/component/Input/Input';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserInformationProps {}

const UserInformation: React.FC<UserInformationProps> = ({}) => {
  const styles = createStyle();

  return (
    <UserDetailCard title={'Information'}>
      <Input
        multiline
        placeholder="These notes are internal and only visible to you"
        label="User Notes"
        defaultValue=""
        errorMessage=""
        otherStyle={{marginTop: 0}}
      />
      <ButtonSmall
        colorTheme="dark"
        style={{
          padding: horizontalMarginScale(12),
          borderRadius: radiusScale(99),
          alignSelf: 'flex-start',
          marginTop: verticalMarginScale(8),
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

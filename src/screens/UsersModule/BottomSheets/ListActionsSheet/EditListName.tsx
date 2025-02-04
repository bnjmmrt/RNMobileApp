import React from 'react';
import {View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Input from 'src/component/Input/Input';
import {verticalMarginScale} from 'src/utils/dimensions';
import {styles} from './style';

const EditListName = ({onSuccess}: {onSuccess: () => void}) => {
  return (
    <View style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>{'Edit List Name'}</CustomText>
      <CustomText style={styles.editListMessage}>
        {'Enter a new name for your list'}
      </CustomText>
      <Input
        placeholder=""
        label="List Name"
        defaultValue=""
        errorMessage=""
        otherStyle={{marginBottom: verticalMarginScale(24), marginTop: 0}}
      />

      <Button
        title="Edit List Name"
        colorTheme="dark"
        style={styles.actionCta}
        onPress={onSuccess}
      />
    </View>
  );
};

export default EditListName;

import React from 'react';
import {View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Input from 'src/component/Input/Input';
import {verticalMarginScale} from 'src/utils/dimensions';
import {styles} from './style';

const DuplicateList = ({onSuccess}: {onSuccess: () => void}) => {
  return (
    <View style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>
        {'Do you want to duplicate this list? '}
      </CustomText>
      <CustomText style={styles.editListMessage}>
        {'All users in this list will also be added to the new list.'}
      </CustomText>
      <Input
        placeholder=""
        label="List Name"
        defaultValue=""
        errorMessage=""
        otherStyle={{marginBottom: verticalMarginScale(24), marginTop: 0}}
      />

      <Button
        title="Duplicate List"
        colorTheme="dark"
        style={styles.actionCta}
        onPress={onSuccess}
      />
    </View>
  );
};

export default DuplicateList;

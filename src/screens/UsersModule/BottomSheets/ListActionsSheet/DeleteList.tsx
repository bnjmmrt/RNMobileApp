import React from 'react';
import {TextInput, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import {styles} from './style';
import Input from 'src/component/Input/Input';
import {verticalMarginScale} from 'src/utils/dimensions';

const DeleteList = ({onSuccess}: {onSuccess: () => void}) => {
  return (
    <View style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>
        {'Are you sure you want to delete this list?'}
      </CustomText>
      <CustomText style={styles.deleteListMessage}>
        {
          'The list will be deleted but the users won’t be removed from the database.'
        }
      </CustomText>

      <Button
        title="Delete List"
        colorTheme="dark"
        style={[styles.actionCta, styles.deleteCta]}
        onPress={() => {}}
      />
    </View>
  );
};

export default DeleteList;

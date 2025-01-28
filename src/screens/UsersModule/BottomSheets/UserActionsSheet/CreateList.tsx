import React from 'react';
import {TextInput, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import {styles} from './style';

const CreateList = ({
  onPressBack,
  onSuccess,
}: {
  onPressBack: () => void;
  onSuccess: () => {};
}) => {
  return (
    <View>
      <Header
        headerTitle="List Name"
        showBackButton={true}
        showProgressBar={false}
        onPress={onPressBack}
      />
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.createListMessage}>
          {'Create a name for your list'}
        </CustomText>

        <CustomText style={styles.listNameInputLabel}>{'List Name'}</CustomText>
        <TextInput
          style={styles.listNameInput}
          placeholder="What would you like to report?"
          verticalAlign="top"
        />
        <Button
          title="Add to List"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default CreateList;

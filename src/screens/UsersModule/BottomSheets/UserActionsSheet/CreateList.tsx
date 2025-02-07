import React from 'react';
import {TextInput, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import {styles} from './style';
import Input from 'src/component/Input/Input';
import {verticalMarginScale} from 'src/utils/dimensions';

const CreateList = ({
  onPressBack,
  onSuccess,
}: {
  onPressBack: () => void;
  onSuccess: () => void;
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

        <Input
          label="List Name"
          placeholder=""
          forBottomSheet={true}
          errorMessage={''}
        />
        <Button
          title="Add to List"
          colorTheme="dark"
          style={[styles.actionCta, {marginTop: verticalMarginScale(24)}]}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default CreateList;

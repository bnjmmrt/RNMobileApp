import React, {useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {useAddNewCustomListMutation} from 'src/redux/actions/listsApiAction';
import {verticalMarginScale} from 'src/utils/dimensions';
import {actionSheetFromType} from '.';
import {styles} from './style';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {BottomSheetView} from '@gorhom/bottom-sheet';

const CreateList = ({
  onPressBack,
  onSuccess,
  showError,
  selectedUsers = [],
  from,
}: {
  onPressBack: () => void;
  onSuccess: () => void;
  showError: (message: string) => void;
  selectedUsers?: string[];
  from?: actionSheetFromType;
}) => {
  const listNameRef = useRef<InputRefMethods>(null);

  const [customListName, setCustomListName] = useState<string>('');

  const [
    createNewList,
    {error: createNewListError, isLoading: createNewListLoading},
  ] = useAddNewCustomListMutation();

  const onPressAddToList = async () => {
    Keyboard.dismiss();
    listNameRef?.current?.validateInputs();
    if (listNameRef?.current?.validateInputs()) {
      const payload = {
        customName: customListName,
        userIds: selectedUsers,
      };
      try {
        const response = await createNewList(payload).unwrap();
        if (response.status === 200) {
          onSuccess();
        } else {
          const typedError = response as ApiErrorInterface;
          showError(getErrorMessage(typedError));
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        showError(getErrorMessage(typedError));
      }
    }
  };

  return (
    <BottomSheetView>
      <Header
        headerTitle="List Name"
        showBackButton={from === 'customLists' ? false : true}
        showProgressBar={false}
        onPress={onPressBack}
      />
      <BottomSheetView style={styles.actionContentWrapper}>
        <CustomText style={styles.createListMessage}>
          {'Create a name for your list'}
        </CustomText>

        <Input
          ref={listNameRef}
          label="List Name"
          placeholder=""
          forBottomSheet={true}
          errorMessage={'Please enter list name'}
          defaultValue={customListName}
          onChangeText={setCustomListName}
          isRequired={true}
        />
        <Button
          title={from === 'customLists' ? 'Create a List' : 'Add to List'}
          colorTheme="dark"
          style={[styles.actionCta, {marginTop: verticalMarginScale(24)}]}
          onPress={onPressAddToList}
          loading={createNewListLoading}
        />
      </BottomSheetView>
    </BottomSheetView>
  );
};

export default CreateList;

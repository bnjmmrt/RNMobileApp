import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {verticalMarginScale} from 'src/utils/dimensions';
import {styles} from './style';
import {listActionCurrentPageType} from '.';
import {
  useAddNewCustomListMutation,
  useEditCustomListMutation,
} from 'src/redux/actions/listsApiAction';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {BottomSheetView} from '@gorhom/bottom-sheet';

const EditListName = ({
  onSuccessAdd,
  onSuccessEdit,
  selectedAction,
  showError,
  listId,
  listName,
}: {
  onSuccessAdd: (listId: string, listName: string) => void;
  onSuccessEdit: () => void;
  selectedAction: listActionCurrentPageType;
  showError: (message: string) => void;
  listId?: string;
  listName?: string;
}) => {
  const listNameRef = useRef<InputRefMethods>(null);

  const [customName, setCustomName] = useState<string>(listName || '');

  const [addNewCustomList, {error, isLoading: createListLoading}] =
    useAddNewCustomListMutation();
  const [
    editCustomList,
    {error: editCustomListError, isLoading: editListLoading},
  ] = useEditCustomListMutation();

  const resetForm = () => {
    setCustomName('');
  };

  const onPressAddList = async () => {
    listNameRef?.current?.validateInputs();
    if (listNameRef?.current?.validateInputs()) {
      try {
        const response = await addNewCustomList({
          customName: customName,
          userIds: [],
        }).unwrap();
        if (response.status === 200) {
          resetForm();
          onSuccessAdd(response?.data?.id, response?.data?.name);
        } else {
          showError('Something went wrong!');
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        showError(getErrorMessage(typedError));
      }
    }
  };

  const onPressEditList = async () => {
    console.log(';sss;s;s');

    listNameRef?.current?.validateInputs();
    if (listNameRef?.current?.validateInputs() && listId) {
      try {
        const response = await editCustomList({
          customName: customName,
          listId: listId,
        }).unwrap();
        if (response.status === 200) {
          resetForm();
          onSuccessEdit();
        } else {
          showError('Something went wrong!');
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        showError(getErrorMessage(typedError));
      }
    }
  };

  useEffect(() => {
    if (listName) {
      setCustomName(listName);
    }
  }, [listName]);

  return (
    <BottomSheetView style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>
        {selectedAction === 'createList' ? 'Create a List' : 'Edit List Name'}
      </CustomText>
      <CustomText style={styles.editListMessage}>
        {selectedAction === 'createList'
          ? 'Create a name for your list'
          : 'Enter a new name for your list'}
      </CustomText>

      <Input
        ref={listNameRef}
        errorMessage={'Please enter list name'}
        label="List Name"
        defaultValue={customName}
        onChangeText={text => setCustomName(text)}
        forBottomSheet={true}
      />

      <Button
        title={
          selectedAction === 'createList' ? 'Create a List' : 'Edit List Name'
        }
        colorTheme="dark"
        style={[
          styles.actionCta,
          {
            marginBottom: verticalMarginScale(24),
            marginTop: verticalMarginScale(24),
          },
        ]}
        onPress={() => {
          Keyboard.dismiss();
          if (selectedAction === 'createList') {
            onPressAddList();
          } else {
            onPressEditList();
          }
        }}
        loading={createListLoading || editListLoading}
      />
    </BottomSheetView>
  );
};

export default EditListName;

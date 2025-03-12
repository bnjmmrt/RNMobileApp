import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import { customListType } from 'src/navigation/AppStack';
import { useDuplicateCustomListMutation } from 'src/redux/actions/listsApiAction';
import { verticalMarginScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { styles } from './style';

const DuplicateList = ({
  onSuccess,
  showError,
  listId,
  listName,
  listType,
}: {
  onSuccess: () => void;
  showError: (message: string) => void;
  listId: string;
  listName?: string;
  listType: customListType;
}) => {
  const listNameRef = useRef<InputRefMethods>(null);

  const [customName, setCustomName] = useState<string>(listName || '');

  const [
    duplicateCustomList,
    { error: duplicateCustomListError, isLoading: duplicateListLoading },
  ] = useDuplicateCustomListMutation();

  const resetForm = () => {
    setCustomName('');
  };

  const onPressDuplicateList = async () => {
    if (listNameRef?.current?.validateInputs()) {
      try {
        const response = await duplicateCustomList({
          customName: customName,
          listId: listId,
          listType:
            listType === 'favorite'
              ? 'favorite'
              : listType === 'follower'
              ? 'followed'
              : 'custom',
        }).unwrap();
        if (response.success) {
          resetForm();
          onSuccess();
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
        {'Do you want to duplicate this list? '}
      </CustomText>
      <CustomText style={styles.editListMessage}>
        {'All users in this list will also be added to the new list.'}
      </CustomText>

      <Input
        ref={listNameRef}
        errorMessage={'Please enter list name'}
        label="List Name"
        defaultValue={customName}
        onChangeText={text => setCustomName(text)}
        forBottomSheet={true}
        otherStyle={{ marginBottom: verticalMarginScale(24) }}
      />

      <Button
        title="Duplicate List"
        colorTheme="dark"
        style={styles.actionCta}
        onPress={onPressDuplicateList}
        loading={duplicateListLoading}
      />
    </BottomSheetView>
  );
};

export default DuplicateList;

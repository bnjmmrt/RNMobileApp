import React from 'react';
import {View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {useDeleteCustomListMutation} from 'src/redux/actions/listsApiAction';
import {styles} from './style';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {BottomSheetView} from '@gorhom/bottom-sheet';

const DeleteList = ({
  onSuccess,
  listId,
  showError,
}: {
  onSuccess: () => void;
  listId: string;
  showError: (message: string) => void;
}) => {
  const [
    deleteCustomList,
    {error: deleteCustomListError, isLoading: deleteCustomListLoading},
  ] = useDeleteCustomListMutation();

  const onPressDeleteList = async () => {
    if (!listId) {
      showError('Please select a list first to delete!');
      return;
    }
    const payload = {
      listId: listId,
    };
    try {
      const response = await deleteCustomList(payload).unwrap();
      if (response.status === 200) {
        onSuccess();
      } else {
        showError('Something went wrong!');
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      showError(getErrorMessage(typedError));
    }
  };

  return (
    <BottomSheetView style={styles.actionContentWrapper}>
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
        onPress={onPressDeleteList}
        loading={deleteCustomListLoading}
      />
    </BottomSheetView>
  );
};

export default DeleteList;

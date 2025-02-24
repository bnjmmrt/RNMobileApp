import {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {useRemoveUsersFromCustomListMutation} from 'src/redux/actions/listsApiAction';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {styles} from './style';

interface DeleteListUsersPropsInterface {
  listName: string;
  listId: string;
  selectedUsers: string[];
  onSuccess: () => void;
}

const DeleteListUsersSheet = forwardRef<
  BottomSheetMethods,
  DeleteListUsersPropsInterface
>(({listName, listId, selectedUsers = [], onSuccess}, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const [
    removeUsersFromList,
    {error: removeUsersFromListError, isLoading: removeUsersFromListLoading},
  ] = useRemoveUsersFromCustomListMutation();

  const onPressRemoveUsers = async () => {
    if (selectedUsers?.length === 0) {
      FlashMessageComponent.show(
        'error',
        'Please select users to add in list!',
      );
      return;
    }

    const payload = {
      customName: listName,
      userIds: selectedUsers || [],
      listId: listId,
    };
    try {
      const response = await removeUsersFromList(payload).unwrap();
      if (response.status === 200) {
        onSuccess();
        sheetRef.current?.close();
      } else {
        FlashMessageComponent.show('error', 'Something went wrong!');
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={['50%']} // Adjustable snap points
      enableDynamicSizing
      onClose={() => console.log('Bottom sheet closed')}>
      <BottomSheetView style={styles.actionContentWrapper}>
        <CustomText style={styles.title}>{'Remove user from list?'}</CustomText>
        <CustomText style={styles.message}>
          {'Are you sure you want to remove [User Name] from this list?'}
        </CustomText>

        <Button
          title="Remove"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onPressRemoveUsers}
          loading={removeUsersFromListLoading}
        />
      </BottomSheetView>
    </BottomSheetComponent>
  );
});

export default DeleteListUsersSheet;

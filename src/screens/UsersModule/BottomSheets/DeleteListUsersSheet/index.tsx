import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { useRemoveUsersFromCustomListMutation } from 'src/redux/actions/listsApiAction';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { styles } from './style';
import { UserItemInterface } from '../../UsersListItem';

interface DeleteListUsersPropsInterface {
  listName: string;
  listId: string;
  selectedUsers: UserItemInterface[];
  onSuccess: () => void;
}

const DeleteListUsersSheet = forwardRef<
  BottomSheetMethods,
  DeleteListUsersPropsInterface
>(({ listName, listId, selectedUsers = [], onSuccess }, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const [
    removeUsersFromList,
    { error: removeUsersFromListError, isLoading: removeUsersFromListLoading },
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
      userIds: selectedUsers.map(user => user.listMappingId) || [],
      listId: listId,
    };
    try {
      const response = await removeUsersFromList(payload).unwrap();
      if (response.success) {
        if (selectedUsers.length === 1) {
          FlashMessageComponent.show(
            'success',
            `${selectedUsers[0].name} has been removed from list`,
          );
        } else {
          FlashMessageComponent.show(
            'success',
            `${selectedUsers.length} ${
              selectedUsers.length > 1 ? 'users' : 'user'
            } has been removed from list`,
          );
        }
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

  let message = `Are you sure you want to remove ${
    selectedUsers.length > 1
      ? `${selectedUsers.length} users`
      : `${selectedUsers.length} user`
  } from this list?`;
  if (selectedUsers.length === 1) {
    message = `Are you sure you want to remove ${selectedUsers[0].name} from this list?`;
  }

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={['50%']} // Adjustable snap points
      enableDynamicSizing
      onClose={() => {}}>
      <BottomSheetView style={styles.actionContentWrapper}>
        <CustomText style={styles.title}>
          {selectedUsers?.length > 1
            ? 'Remove users from list?'
            : 'Remove user from list?'}
        </CustomText>
        <CustomText style={styles.message}>{message}</CustomText>

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

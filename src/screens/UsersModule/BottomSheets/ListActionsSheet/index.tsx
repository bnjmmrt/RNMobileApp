import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Alert, View} from 'react-native';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {verticalScale} from 'src/utils/dimensions';
import AddUsersInList from './AddUsersInList';
import DeleteList from './DeleteList';
import DuplicateList from './DuplicateList';
import CreateEditList from './CreateEditList';
import {styles} from './style';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {customListType} from 'src/navigation/AppStack';

export type actionSheetFromType = 'customLists' | 'listDetail';
export type listActionCurrentPageType =
  | 'addUsers'
  | 'createList'
  | 'editListName'
  | 'duplicateList'
  | 'deleteList'
  | '';
interface ListActionsSheetPropsInterface {
  from: actionSheetFromType;
  user?: string;
  selectedUsers?: string[];
  selectedAction: listActionCurrentPageType;
  setSelectedAction: React.Dispatch<
    React.SetStateAction<listActionCurrentPageType>
  >;
  onSuccess?: () => void;
  selectedListId?: string;
  selectedListName?: string;
  listType: customListType;
}

const ListActionsSheet = forwardRef<
  BottomSheetMethods,
  ListActionsSheetPropsInterface
>(
  (
    {
      selectedAction,
      setSelectedAction,
      selectedListId,
      selectedListName,
      onSuccess,
      listType,
    },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheetMethods>(null);

    const [selectedListData, setSelectedListData] = useState<{
      id: string;
      name: string;
    }>();

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
      showFlashMessage: (type, message) =>
        sheetRef.current?.showFlashMessage(type, message),
    }));

    const snapPoints =
      selectedAction === 'editListName'
        ? [`${verticalScale(40)}%`]
        : selectedAction === 'createList'
        ? [`${verticalScale(40)}%`]
        : selectedAction === 'duplicateList'
        ? [`${verticalScale(50)}%`]
        : selectedAction === 'deleteList'
        ? [`${verticalScale(40)}%`]
        : selectedAction === 'addUsers'
        ? [`${verticalScale(70)}%`]
        : [`${verticalScale(35)}%`];

    const closeSheet = () => {
      sheetRef?.current?.close();
    };

    const showError = (message: string) => {
      sheetRef?.current?.showFlashMessage('error', message);
    };

    const showSuccess = (message: string) => {
      closeSheet();
      FlashMessageComponent.show('success', message);
    };

    const onCreateListSuccess = (listId: string, listName: string) => {
      setSelectedListData({id: listId, name: listName});
      setSelectedAction('addUsers');
    };

    const onEditListSuccess = () => {
      setSelectedAction('');
      closeSheet();
      if (onSuccess) {
        onSuccess();
      }
    };

    const onAddUserToListSuccess = () => {
      setSelectedAction('');
      closeSheet();
      if (onSuccess) {
        onSuccess();
      }
    };

    const onDuplicateListSuccess = () => {
      if (onSuccess) {
        onSuccess();
      }
      closeSheet();
    };

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={snapPoints} // Adjustable snap points
        onClose={() => {
          setSelectedAction('');
        }}
        enableDynamicSizing={selectedAction === 'addUsers' ? false : true}>
        <BottomSheetView style={{flex: 1}}>
          {selectedAction === '' ? (
            <BottomSheetView style={styles.actionButtonContainer}>
              {listType === 'custom' ? (
                <Button
                  title="Add Users"
                  onPress={() => {
                    setSelectedAction('addUsers');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
              {listType === 'custom' ? (
                <Button
                  title="Edit List Name"
                  onPress={() => {
                    setSelectedAction('editListName');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
              <Button
                title="Duplicate List"
                onPress={() => {
                  setSelectedAction('duplicateList');
                }}
                style={styles.actionButton}
              />
              {listType === 'custom' ? (
                <Button
                  title="Delete List"
                  onPress={() => {
                    setSelectedAction('deleteList');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
            </BottomSheetView>
          ) : null}

          {selectedAction === 'editListName' ||
          selectedAction === 'createList' ? (
            <CreateEditList
              onSuccessAdd={onCreateListSuccess}
              onSuccessEdit={onEditListSuccess}
              selectedAction={selectedAction}
              showError={showError}
              listId={selectedListId}
              listName={selectedListName}
            />
          ) : null}
          {selectedAction === 'duplicateList' ? (
            <DuplicateList
              onSuccess={() => onDuplicateListSuccess()}
              listId={selectedListData?.id || selectedListId || ''}
              listName={selectedListData?.name || selectedListName || ''}
              showError={showError}
            />
          ) : null}
          {selectedAction === 'deleteList' ? (
            <DeleteList
              listId={selectedListId || ''}
              onSuccess={() => {
                closeSheet();
                if (onSuccess) onSuccess();
              }}
              showError={showError}
            />
          ) : null}
          {selectedAction === 'addUsers' ? (
            <AddUsersInList
              onSuccess={onAddUserToListSuccess}
              listId={selectedListData?.id || selectedListId || ''}
              listName={selectedListData?.name || selectedListName || ''}
              showError={showError}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetComponent>
    );
  },
);

export default ListActionsSheet;

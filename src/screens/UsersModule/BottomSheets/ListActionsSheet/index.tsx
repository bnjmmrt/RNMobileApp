import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { InteractionManager } from 'react-native';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { customListType } from 'src/navigation/AppStack';
import AddUsersInList from './AddUsersInList';
import CreateEditList from './CreateEditList';
import DeleteList from './DeleteList';
import DuplicateList from './DuplicateList';
import { styles } from './style';

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
  listUserCount?: number;
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
      from,
      listUserCount,
      selectedUsers,
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
    }));

    const getDyanamicSnapPoints = useCallback(() => {
      switch (selectedAction) {
        case 'addUsers':
          return ['85%'];
        case 'createList':
          return [`40%`];
        case 'deleteList':
          return [`35%`];
        case 'duplicateList':
          return [`50%`];
        case 'editListName':
          return [`40%`];
        case '':
          if (listType === 'custom') {
            return [`35%`];
          } else {
            return [`15%`];
          }
        default:
          return [`35%`];
      }
    }, [selectedAction, listType]);

    const closeSheet = () => {
      sheetRef?.current?.close();
    };

    const showError = (message: string) => {
      FlashMessageComponent.show('error', message);
    };

    const onCreateListSuccess = (listId: string, listName: string) => {
      setSelectedListData({ id: listId, name: listName });
      closeSheet();
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          setSelectedAction('addUsers');
          sheetRef?.current?.open();
        }, 1000);
      });
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

    const getDyanamicSizeConfig = useCallback(() => {
      if (selectedAction === 'addUsers') {
        return false;
      } else {
        return true;
      }
    }, [selectedAction, listType]);

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={getDyanamicSnapPoints()} // Adjustable snap points
        onClose={() => {
          if (from === 'listDetail') {
            sheetRef?.current?.close();
          }
          setSelectedAction('');
        }}
        enableDynamicSizing={getDyanamicSizeConfig()}>
        <BottomSheetView style={{ flex: 1 }}>
          {selectedAction === '' ? (
            <BottomSheetView
              style={[styles.actionButtonContainer, { flex: 1 }]}>
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
                disabled={listUserCount === 0}
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
              listType={listType}
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
              listName={selectedListData?.name || selectedListName || ''}
            />
          ) : null}
          {selectedAction === 'addUsers' ? (
            <AddUsersInList
              closeSheet={closeSheet}
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

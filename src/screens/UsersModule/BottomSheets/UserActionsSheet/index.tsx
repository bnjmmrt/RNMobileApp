import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {
  useLazyFetchUserDetailsQuery,
  UserDetailResponse,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { verticalScale } from 'src/utils/dimensions';
import AddToList from './AddToList';
import CreateList from './CreateList';
import DeleteUser from './DeleteUser';
import MarkAsSpam from './MarkAsSpam';
import ReportUser from './ReportUser';
import { styles } from './style';

export type actionSheetFromType = 'usersList' | 'customLists' | 'userDetail';
export type UserActionCurrentPageType =
  | 'addToList'
  | 'createList'
  | 'markSpam'
  | 'unmarkSpam'
  | 'report'
  | 'delete'
  | '';
export interface UserListActionPropsInterface {
  from: actionSheetFromType;
  user?: string;
  selectedUsers?: string[];
  onSuccess?: () => void;
  selectedAction: UserActionCurrentPageType;
  setSelectedAction: React.Dispatch<
    React.SetStateAction<UserActionCurrentPageType>
  >;
}

const UserActionsSheet = forwardRef<
  BottomSheetMethods,
  UserListActionPropsInterface
>(
  (
    { user, from, selectedUsers, onSuccess, selectedAction, setSelectedAction },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheetMethods>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
      showFlashMessage: (type, message) =>
        sheetRef.current?.showFlashMessage(type, message),
    }));

    const { userDetails } = useSelector((state: RootState) => {
      const queryResult = state.api.queries[
        `fetchUserDetails(${JSON.stringify({ user })})`
      ] as { data: UserDetailResponse } | undefined;

      return {
        userDetails: queryResult?.data?.data ?? undefined,
      };
    }, shallowEqual);

    const [fetchUserDetails, {}] = useLazyFetchUserDetailsQuery();

    const snapPoints =
      selectedAction === 'report'
        ? ['60%']
        : selectedAction === 'markSpam'
        ? ['35%']
        : selectedAction === 'delete'
        ? ['30%']
        : selectedAction === 'addToList'
        ? ['60%']
        : selectedAction === 'createList'
        ? ['45%']
        : ['30%'];

    const onCreateListSuccess = () => {
      closeSheet();
      if (onSuccess) {
        onSuccess();
      }
    };

    const onAddUserToListSuccess = () => {
      if (onSuccess) {
        onSuccess();
      }
      closeSheet();
    };

    const closeSheet = () => {
      setSelectedAction('');
      sheetRef?.current?.close();
      if (from === 'userDetail' && user) {
        fetchUserDetails({ user: user });
      }
    };

    const showError = (message: string) => {
      FlashMessageComponent.show('error', message);
    };

    const showSuccess = (message: string) => {
      closeSheet();
      FlashMessageComponent.show('success', message);
    };

    const getDyanamicSizeConfig = useCallback(() => {
      if (selectedAction === 'addToList') {
        return false;
      } else if (selectedAction === 'createList') {
        return false;
      } else if (selectedAction === 'report') {
        return false;
      } else {
        return true;
      }
    }, [selectedAction, from]);

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={snapPoints} // Adjustable snap points
        enableDynamicSizing={getDyanamicSizeConfig()}
        onClose={() => {
          closeSheet();
        }}>
        <BottomSheetView style={{ flex: 1 }}>
          {selectedAction === '' ? (
            <BottomSheetView style={styles.actionButtonContainer}>
              {/* <Button
                title={'Delete User'}
                onPress={() => {
                  setSelectedAction('delete');
                }}
                style={styles.actionButton}
              /> */}
              <Button
                title="Add to list"
                onPress={() => {
                  setSelectedAction('addToList');
                }}
                style={styles.actionButton}
              />
              <Button
                title={userDetails?.isSpam ? 'Unmark as Spam' : 'Mark as Spam'}
                onPress={() => {
                  setSelectedAction('markSpam');
                }}
                style={styles.actionButton}
              />
              <Button
                title="Report User"
                onPress={() => {
                  setSelectedAction('report');
                }}
                style={styles.actionButton}
              />
            </BottomSheetView>
          ) : null}
          {selectedAction === 'report' ? (
            <ReportUser
              onPressBack={() => setSelectedAction('')}
              showError={showError}
              showSuccess={showSuccess}
              user={user || ''}
            />
          ) : null}
          {selectedAction === 'markSpam' ? (
            <MarkAsSpam
              showError={showError}
              showSuccess={showSuccess}
              user={user || ''}
            />
          ) : null}
          {selectedAction === 'delete' ? (
            <DeleteUser
              showError={showError}
              showSuccess={showSuccess}
              user={user || ''}
            />
          ) : null}
          {selectedAction === 'addToList' ? (
            <AddToList
              onSuccess={() => onAddUserToListSuccess()}
              onPressCreateList={() => {
                setSelectedAction('createList');
              }}
              showError={showError}
              selectedUsers={selectedUsers}
            />
          ) : null}
          {selectedAction === 'createList' ? (
            <CreateList
              onPressBack={() => setSelectedAction('addToList')}
              onSuccess={() => onCreateListSuccess()}
              showError={showError}
              selectedUsers={selectedUsers}
              from={from}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetComponent>
    );
  },
);

export default UserActionsSheet;

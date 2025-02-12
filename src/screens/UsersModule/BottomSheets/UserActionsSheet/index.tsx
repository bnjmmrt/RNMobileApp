import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {
  useLazyFetchUserDetailsQuery,
  UserDetailResponse,
} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import AddToList from './AddToList';
import CreateList from './CreateList';
import MarkAsSpam from './MarkAsSpam';
import ReportUser from './ReportUser';
import {styles} from './style';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {verticalScale} from 'src/utils/dimensions';
import {UserItemInterface} from '../../UsersListItem';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {useLazyFetchAllCustomListsQuery} from 'src/redux/actions/listsApiAction';

export type actionSheetFromType = 'usersList' | 'customLists' | 'userDetail';
export type UserActionCurrentPageType =
  | 'addToList'
  | 'createList'
  | 'markSpam'
  | 'unmarkSpam'
  | 'report'
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
    {user, from, selectedUsers, onSuccess, selectedAction, setSelectedAction},
    ref,
  ) => {
    const sheetRef = useRef<BottomSheetMethods>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
      showFlashMessage: (type, message) =>
        sheetRef.current?.showFlashMessage(type, message),
    }));

    const {userDetails} = useSelector((state: RootState) => {
      const queryResult = state.api.queries[
        `fetchUserDetails(${JSON.stringify({user})})`
      ] as {data: UserDetailResponse} | undefined;

      return {
        userDetails: queryResult?.data?.data ?? undefined,
      };
    }, shallowEqual);

    const [fetchUserDetails, {}] = useLazyFetchUserDetailsQuery();

    const snapPoints =
      selectedAction === 'report'
        ? [`${verticalScale(60)}%`]
        : selectedAction === 'markSpam'
        ? [`${verticalScale(40)}%`]
        : selectedAction === 'addToList'
        ? [`${verticalScale(60)}%`]
        : selectedAction === 'createList'
        ? [`${verticalScale(45)}%`]
        : ['25%'];

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
        fetchUserDetails({user: user});
      }
    };

    const showError = (message: string) => {
      sheetRef?.current?.showFlashMessage('error', message);
    };

    const showSuccess = (message: string) => {
      closeSheet();
      FlashMessageComponent.show('success', message);
    };

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={snapPoints} // Adjustable snap points
        enableDynamicSizing={selectedAction !== 'addToList' ? true : false}
        onClose={() => {
          closeSheet();
          setSelectedAction('');
        }}>
        <BottomSheetView style={{flex: 1}}>
          {selectedAction === '' ? (
            <BottomSheetView style={styles.actionButtonContainer}>
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

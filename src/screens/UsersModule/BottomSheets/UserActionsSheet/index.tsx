import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
import AddToList from './AddToList';
import CreateList from './CreateList';
import DeleteUser from './DeleteUser';
import MarkAsSpam from './MarkAsSpam';
import ReportUser from './ReportUser';
import { styles } from './style';
import { setUsersTabAllListsRefresh } from 'src/redux/slices/listSkipSlice';
import { useFetchAllCustomListsQuery } from 'src/redux/actions/listsApiAction';

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
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const { userDetails } = useSelector((state: RootState) => {
      const queryResult = state.api.queries[
        `fetchUserDetails(${JSON.stringify({ user })})`
      ] as { data: UserDetailResponse } | undefined;

      return {
        userDetails: queryResult?.data?.data ?? undefined,
      };
    }, shallowEqual);

    const [fetchUserDetails, { }] = useLazyFetchUserDetailsQuery();
    const isNonMemberHasNotAppliedUser =
      userDetails?.hostUserMappingId && userDetails?.eventCount === 0;

    const { data, isLoading } = useFetchAllCustomListsQuery({
      take: 20,
      skip: 0,
    });

    const calculateHeight = `${(data?.data?.result?.length * 7) + 5}%`;
    const snapPoints =
      selectedAction === 'report'
        ? ['60%']
        : selectedAction === 'markSpam'
          ? ['35%']
          : selectedAction === 'delete'
            ? ['33%']
            : selectedAction === 'addToList'
              ? data?.data?.count > 9 ? ['60%'] : [calculateHeight]
              : selectedAction === 'createList'
                ? ['45%']
                : isNonMemberHasNotAppliedUser
                  ? ['24%']
                  : ['30%'];

    const onCreateListSuccess = () => {
      dispatch(setUsersTabAllListsRefresh());
      closeSheet();
      if (onSuccess) {
        onSuccess();
      }
    };

    const onAddUserToListSuccess = () => {
      dispatch(setUsersTabAllListsRefresh());
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

    // userDetails?.role === 'non_member' &&
    // userDetails?.status === 'NEW_APPLICANT' &&

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
    }, [selectedAction, from, isNonMemberHasNotAppliedUser]);

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
              {isNonMemberHasNotAppliedUser ? (
                <Button
                  title={'Delete User'}
                  onPress={() => {
                    setSelectedAction('delete');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
              <Button
                title="Add to list"
                onPress={() => {
                  setSelectedAction('addToList');
                }}
                style={styles.actionButton}
              />
              {!isNonMemberHasNotAppliedUser ? (
                <Button
                  title={
                    userDetails?.isSpam ? 'Unmark as Spam' : 'Mark as Spam'
                  }
                  onPress={() => {
                    setSelectedAction('markSpam');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
              {!isNonMemberHasNotAppliedUser ? (
                <Button
                  title="Report User"
                  onPress={() => {
                    setSelectedAction('report');
                  }}
                  style={styles.actionButton}
                />
              ) : null}
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

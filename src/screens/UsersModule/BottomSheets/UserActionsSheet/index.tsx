import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
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

const UserActionsSheet = forwardRef<BottomSheetMethods, {user: string}>(
  ({user}, ref) => {
    const sheetRef = useRef<BottomSheetMethods>(null);
    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
      showFlashMessage: (type, message) =>
        sheetRef.current?.showFlashMessage(type, message),
    }));

    const [selectedAction, setSelectedAction] = useState<
      'addToList' | 'createList' | 'markSpam' | 'unmarkSpam' | 'report' | ''
    >('');

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
        ? [`${verticalScale(50)}%`]
        : selectedAction === 'markSpam'
        ? ['30%']
        : selectedAction === 'addToList'
        ? ['50%', '90%']
        : selectedAction === 'createList'
        ? [`${verticalScale(35)}%`]
        : ['25%'];

    const onSpamSuccess = () => {
      setSelectedAction('');
    };

    const closeSheet = () => {
      setSelectedAction('');
      sheetRef?.current?.close();
      fetchUserDetails({user: user});
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
        onClose={() => {
          closeSheet();
          setSelectedAction('');
        }}>
        <>
          {selectedAction === '' ? (
            <View style={styles.actionButtonContainer}>
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
            </View>
          ) : null}
          {selectedAction === 'report' ? (
            <ReportUser
              onPressBack={() => setSelectedAction('')}
              showError={showError}
              showSuccess={showSuccess}
              user={user}
            />
          ) : null}
          {selectedAction === 'markSpam' ? (
            <MarkAsSpam
              showError={showError}
              showSuccess={showSuccess}
              user={user}
            />
          ) : null}
          {selectedAction === 'addToList' ? (
            <AddToList
              onPressBack={() => setSelectedAction('')}
              onSuccess={() => onSpamSuccess()}
              onPressCreateList={() => {
                setSelectedAction('createList');
              }}
            />
          ) : null}
          {selectedAction === 'createList' ? (
            <CreateList
              onPressBack={() => setSelectedAction('addToList')}
              onSuccess={() => onSpamSuccess()}
            />
          ) : null}
        </>
      </BottomSheetComponent>
    );
  },
);

export default UserActionsSheet;

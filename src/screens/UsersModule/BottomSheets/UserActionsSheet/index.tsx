import React, {forwardRef, useState} from 'react';
import {View} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import ReportUser from './ReportUser';
import {styles} from './style';
import MarkAsSpam from './MarkAsSpam';
import AddToList from './AddToList';
import CreateList from './CreateList';

const UserActionsSheet = forwardRef((props, ref) => {
  const [selectedAction, setSelectedAction] = useState<
    'addToList' | 'createList' | 'markSpam' | 'unmarkSpam' | 'report' | ''
  >('');

  const snapPoints =
    selectedAction === 'report'
      ? ['50%']
      : selectedAction === 'markSpam'
      ? ['30%']
      : selectedAction === 'addToList'
      ? ['50%', '90%']
      : selectedAction === 'createList'
      ? ['35%']
      : ['25%'];

  const onReportSuccess = () => {
    setSelectedAction('');
    ref?.current?.close();
  };
  const onSpamSuccess = () => {
    setSelectedAction('');
    ref?.current?.close();
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={snapPoints} // Adjustable snap points
      onClose={() => console.log('Bottom sheet closed')}>
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
              title="Mark as Spam"
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
            onSuccess={() => onReportSuccess()}
          />
        ) : null}
        {selectedAction === 'markSpam' ? (
          <MarkAsSpam
            onPressBack={() => setSelectedAction('')}
            onSuccess={() => onSpamSuccess()}
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
            onPressCreateList={() => {
              setSelectedAction('createList');
            }}
          />
        ) : null}
      </>
    </BottomSheetComponent>
  );
});

export default UserActionsSheet;

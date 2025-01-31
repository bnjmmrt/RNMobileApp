import React, {forwardRef, useState} from 'react';
import {View} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {verticalScale} from 'src/utils/dimensions';
import AddUsersInList from './AddUsersInList';
import DeleteList from './DeleteList';
import DuplicateList from './DuplicateList';
import EditListName from './EditListName';
import {styles} from './style';

const ListActionsSheet = forwardRef((props, ref) => {
  const [selectedAction, setSelectedAction] = useState<
    'addUsers' | 'editListName' | 'duplicateList' | 'deleteList' | ''
  >('');

  const snapPoints =
    selectedAction === 'editListName'
      ? [`${verticalScale(33)}%`]
      : selectedAction === 'duplicateList'
      ? [`${verticalScale(38)}%`]
      : selectedAction === 'deleteList'
      ? [`${verticalScale(30)}%`]
      : selectedAction === 'addUsers'
      ? [`${verticalScale(70)}%`]
      : ['30%'];

  const closeSheet = () => {
    ref?.current?.close();
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={snapPoints} // Adjustable snap points
      onClose={() => {
        setSelectedAction('');
        console.log('Bottom sheet closed');
      }}>
      <>
        {selectedAction === '' ? (
          <View style={styles.actionButtonContainer}>
            <Button
              title="Add Users"
              onPress={() => {
                setSelectedAction('addUsers');
              }}
              style={styles.actionButton}
            />
            <Button
              title="Edit List Name"
              onPress={() => {
                setSelectedAction('editListName');
              }}
              style={styles.actionButton}
            />
            <Button
              title="Duplicate List"
              onPress={() => {
                setSelectedAction('duplicateList');
              }}
              style={styles.actionButton}
            />
            <Button
              title="Delete List"
              onPress={() => {
                setSelectedAction('deleteList');
              }}
              style={styles.actionButton}
            />
          </View>
        ) : null}

        {selectedAction === 'editListName' ? (
          <EditListName onSuccess={() => closeSheet()} />
        ) : null}
        {selectedAction === 'duplicateList' ? (
          <DuplicateList onSuccess={() => closeSheet()} />
        ) : null}
        {selectedAction === 'deleteList' ? (
          <DeleteList onSuccess={() => closeSheet()} />
        ) : null}
        {selectedAction === 'addUsers' ? (
          <AddUsersInList onSuccess={() => closeSheet()} />
        ) : null}
      </>
    </BottomSheetComponent>
  );
});

export default ListActionsSheet;

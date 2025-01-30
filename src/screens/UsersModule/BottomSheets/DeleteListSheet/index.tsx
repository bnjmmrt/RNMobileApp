import React, {forwardRef} from 'react';
import {View} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {styles} from './style';

const DeleteListSheet = forwardRef((props, ref) => {
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['30%']} // Adjustable snap points
      onClose={() => console.log('Bottom sheet closed')}>
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.title}>
          {'Are you sure you want to delete this list?'}
        </CustomText>
        <CustomText style={styles.message}>
          {
            'The list will be deleted but the users won’t be removed from the database.'
          }
        </CustomText>

        <Button
          title="Delete List"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={() => {}}
        />
      </View>
    </BottomSheetComponent>
  );
});

export default DeleteListSheet;

import React, {forwardRef} from 'react';
import {View} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {styles} from './style';

const DeleteListUsersSheet = forwardRef((props, ref) => {
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['30%']} // Adjustable snap points
      onClose={() => console.log('Bottom sheet closed')}>
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.title}>{'Remove user from list?'}</CustomText>
        <CustomText style={styles.message}>
          {'Are you sure you want to remove [User Name] from this list?'}
        </CustomText>

        <Button
          title="Remove"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={() => {}}
        />
      </View>
    </BottomSheetComponent>
  );
});

export default DeleteListUsersSheet;

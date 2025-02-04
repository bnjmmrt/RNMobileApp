import React, {forwardRef} from 'react';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import {verticalScale} from 'src/utils/dimensions';
import DeleteList from '../ListActionsSheet/DeleteList';

const DeleteListSheet = forwardRef((props, ref) => {
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[`${verticalScale(30)}%`]} // Adjustable snap points
      onClose={() => console.log('Bottom sheet closed')}>
      <DeleteList onSuccess={() => {}} />
    </BottomSheetComponent>
  );
});

export default DeleteListSheet;

import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import PhoneNumberInput, {
  countryType,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';
import {
  useAddNewUserMutation,
  useLazyFetchAllUsersQuery,
} from 'src/redux/actions/usersApiAction';
import {verticalScale} from 'src/utils/dimensions';
import {styles} from './style';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import AvatarInitials from 'src/component/AvatarInitials';
import IMAGES from '@images/index';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  useAddNewCustomListMutation,
  useFetchAllCustomListsQuery,
  useLazyFetchAllCustomListsQuery,
} from 'src/redux/actions/listsApiAction';

const AddNewCustomListSheet = forwardRef<BottomSheetMethods>(({}, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const listNameRef = useRef<InputRefMethods>(null);

  const [listName, setListName] = useState<string>('');

  const [addNewCustomList, {error, isLoading}] = useAddNewCustomListMutation();
  const [
    fetchLists,
    {data, error: fetchUserError, isLoading: fetchUserLoading},
  ] = useLazyFetchAllCustomListsQuery();

  const resetForm = () => {
    setListName('');
  };

  const onPressAddList = async () => {
    listNameRef?.current?.validateInputs();
    if (listNameRef?.current?.validateInputs()) {
      try {
        const response = await addNewCustomList({
          customName: listName,
          userIds: [],
        }).unwrap();
        if (response.status === 200) {
          sheetRef?.current?.close();
          resetForm();
          fetchLists({skip: 0, take: 10});
          setTimeout(() => {
            FlashMessageComponent.show(
              'success',
              'New list added successfully!',
            );
          }, 1000);
        } else {
          sheetRef?.current?.showFlashMessage('error', 'Something went wrong!');
        }
      } catch (error) {
        sheetRef?.current?.showFlashMessage('error', 'Something went wrong!');
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[`${verticalScale(40)}%`]} // Adjustable snap points
      onClose={() => {}}>
      <BottomSheetScrollView style={styles.container}>
        <CustomText style={styles.title}>{'Create a List'}</CustomText>
        <CustomText style={styles.message}>
          {'Create a name for your list'}
        </CustomText>

        <Input
          ref={listNameRef}
          errorMessage={'Please enter list name'}
          label="List Name"
          defaultValue={listName}
          onChangeText={text => setListName(text)}
          forBottomSheet={true}
        />
        <Button
          title="Create a List"
          colorTheme="dark"
          style={[styles.cta, {marginBottom: 20}]}
          onPress={onPressAddList}
          loading={isLoading}
        />
      </BottomSheetScrollView>
    </BottomSheetComponent>
  );
});

export default AddNewCustomListSheet;

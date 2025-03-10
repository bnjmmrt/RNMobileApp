import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from 'src/component/Button';
import {
  useAddUsersToCustomListMutation,
  useFetchAllCustomListsQuery,
} from 'src/redux/actions/listsApiAction';
import { COLORS } from 'src/utils/constants';
import { Hp, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { ListInterface, ListItemInterface } from '../../Lists';
import { styles } from './style';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FullScreenLoader from 'src/component/FullScreenLoader';

const AddToList = ({
  showError,
  onSuccess,
  onPressCreateList,
  selectedUsers,
}: {
  showError: (message: string) => void;
  onSuccess: () => void;
  onPressCreateList: () => void;
  selectedUsers?: string[];
}) => {
  const [allCustomLists, setAllCustomLists] = useState<ListInterface>({
    count: 0,
    list: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedList, setSelectedList] = useState<ListItemInterface | null>(
    null,
  );

  const { data, isLoading } = useFetchAllCustomListsQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  const [
    addUsersToList,
    { error: addUsersToListError, isLoading: addUsersToListLoading },
  ] = useAddUsersToCustomListMutation();

  const onPressAddToList = async () => {
    if (!selectedList) {
      showError('Please select a list first!');
      return;
    }
    if (selectedUsers?.length === 0) {
      showError('Please select users to add in list!');
      return;
    }
    if (!selectedList?.id) {
      showError('Selected list has no id!');
      return;
    }
    const payload = {
      customName: selectedList?.name,
      userIds: selectedUsers || [],
      listId: selectedList?.id,
    };
    try {
      const response = await addUsersToList(payload).unwrap();
      if (response.status === 200) {
        onSuccess();
      } else {
        const typedError = response as ApiErrorInterface;
        showError(getErrorMessage(typedError));
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      showError(getErrorMessage(typedError));
    }
  };

  const loadMore = () => {
    if (allCustomLists.list?.length < data?.data?.count) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const renderListRow = useCallback(
    ({ item, index }: { item: ListItemInterface; index: number }) => {
      const isSelected = item.id === selectedList?.id;
      return (
        <Button
          title={item.name}
          style={[
            styles.actionButton,
            isSelected && { borderColor: COLORS.black },
          ]}
          onPress={() => setSelectedList(isSelected ? null : item)}
        />
      );
    },
    [selectedList],
  );

  useEffect(() => {
    if (data) {
      setAllCustomLists(prev =>
        currentPage === 1
          ? data.data
          : {
              count: data?.data?.count,
              list: [...prev.list, ...data.data.list],
            },
      );
    }
  }, [data]);

  return (
    <BottomSheetView style={{ flex: 1 }}>
      <BottomSheetFlatList
        data={allCustomLists?.list?.slice(2) || []}
        renderItem={renderListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalScale(8) }}
        // style={{flex: 1}}
        scrollEnabled
        onEndReached={loadMore}
        ListFooterComponent={
          <View style={{ marginBottom: verticalMarginScale(20) }} />
        }
        ListHeaderComponent={<></>}
        ListEmptyComponent={
          isLoading ? (
            <FullScreenLoader
              loading={isLoading}
              customStyle={{
                height: Hp(40),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {''}
            </FullScreenLoader>
          ) : (
            <View
              style={{
                height: Hp(40),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <EventEmptyRecord
                title="No Events"
                subTitle="There are no events available"
                isLoading={isLoading}
              />
            </View>
          )
        }
      />
      <BottomSheetView style={{ marginBottom: verticalMarginScale(20) }}>
        <Button
          title="Add to List"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onPressAddToList}
          loading={addUsersToListLoading}
        />
        <Button
          title="Create a List"
          style={[styles.actionCta, styles.createListCta]}
          onPress={onPressCreateList}
        />
      </BottomSheetView>
    </BottomSheetView>
  );
};

export default AddToList;

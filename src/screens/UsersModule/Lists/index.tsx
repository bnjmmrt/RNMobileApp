/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import GradientSeprator from 'src/component/GradientSeprator';
import { useFetchAllCustomListsQuery } from 'src/redux/actions/listsApiAction';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  Hp,
  verticalScale,
  Wp,
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import ListActionsSheet, {
  listActionCurrentPageType,
} from '../BottomSheets/ListActionsSheet';
import ListItem from '../ListItem';
import createStyle from './style';
import { COLORS } from 'src/utils/constants';

export interface ListUserItemInterface {
  age: number;
  categories: string[];
  city: string;
  followerCount: string;
  gender: number;
  id: string;
  interests: string[];
  isFavourite: boolean;
  listMappingId: string;
  name: string;
  profilePicture: string;
  type: string;
}
export interface ListItemInterface {
  count: number;
  totalCount?: number;
  id: string;
  name: string;
  users: ListUserItemInterface[];
}
export interface ListInterface {
  count: number;
  list: ListItemInterface[];
}
interface ListsProps {}

const Lists: React.FC<ListsProps> = ({}) => {
  const styles = createStyle();
  const actionSheetRef = useRef<BottomSheetMethods>(null);

  const [allCustomLists, setAllCustomLists] = useState<ListInterface>({
    list: [],
    count: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<listActionCurrentPageType>('');
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const { data, isLoading, refetch } = useFetchAllCustomListsQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        setAllCustomLists(data.data);
      } else {
        setAllCustomLists(prev => ({
          count: data.data.count,
          list: [...prev.list, ...data.data.list],
        }));
      }
    }
  }, [data]);

  const loadMore = () => {
    if (allCustomLists?.list?.length < data?.data?.count) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const onRefreshPage = () => {
    setCurrentPage(1);
    refetch();
  };

  const onListActionSheetSuccess = () => {
    actionSheetRef?.current?.close();
    setCurrentPage(1);
    refetch();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ListItemInterface; index: number }) => {
      return (
        <>
          <ListItem
            id={item.id}
            index={index}
            title={item.name}
            userCount={item.count}
            showDelete={index > 1}
            onPressDelete={() => {
              setSelectedList(item.id);
              setSelectedActionSheetAction('deleteList');
              actionSheetRef?.current?.open();
            }}
            listType={
              index === 0 ? 'follower' : index === 1 ? 'favorite' : 'custom'
            }
          />
          {allCustomLists?.list?.length > 2 && index === 1 ? (
            <GradientSeprator style={styles.seprator} />
          ) : null}
        </>
      );
    },
    [allCustomLists?.list],
  );

  const renderListSkeletonItem = (index: number) => {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={verticalMarginScale(20)}
          paddingHorizontal={horizontalMarginScale(16)}
          borderRadius={8}
          borderWidth={1}
          borderColor="#F5F5F5">
          <SkeletonPlaceholder.Item
            width={Wp(40)}
            height={18}
            borderRadius={4}
            backgroundColor={COLORS.tabBorderColor}
          />
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={70}
              height={22}
              borderRadius={99}
              backgroundColor={COLORS.tabBorderColor}
            />
            {index > 1 && (
              <SkeletonPlaceholder.Item
                width={24}
                height={24}
                borderRadius={4}
                marginLeft={horizontalMarginScale(8)}
              />
            )}
            <SkeletonPlaceholder.Item
              width={24}
              height={24}
              borderRadius={4}
              marginLeft={horizontalMarginScale(8)}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  const renderListSkeletonList = () => {
    return (
      <View style={{ flex: 1 }}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={{ marginBottom: verticalMarginScale(16) }}>
              {renderListSkeletonItem(index)}
              {index === 1 && <GradientSeprator style={styles.seprator} />}
            </View>
          ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && currentPage === 1 ? (
        renderListSkeletonList()
      ) : (
        <FlatList
          data={allCustomLists?.list || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ gap: 10 }}
          contentContainerStyle={{ gap: 16 }}
          ListFooterComponent={
            <View style={{ marginBottom: verticalScale(150) }} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          refreshControl={
            allCustomLists?.list?.length > 0 ? (
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefreshPage}
              />
            ) : undefined
          }
          ListEmptyComponent={
            <View
              style={{
                height: Hp(55),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <EventEmptyRecord
                title="No Lists"
                subTitle=""
                isLoading={isLoading}
              />
            </View>
          }
        />
      )}
      <ListActionsSheet
        ref={actionSheetRef}
        from="customLists"
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
        selectedListId={selectedList || ''}
        onSuccess={onListActionSheetSuccess}
        listType="custom"
      />
    </View>
  );
};

export default Lists;

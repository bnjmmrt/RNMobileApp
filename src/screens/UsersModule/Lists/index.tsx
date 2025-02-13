import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import {useFetchAllCustomListsQuery} from 'src/redux/actions/listsApiAction';
import {verticalScale} from 'src/utils/dimensions';
import ListActionsSheet, {
  listActionCurrentPageType,
} from '../BottomSheets/ListActionsSheet';
import ListItem from '../ListItem';
import createStyle from './style';

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

  const {data, isLoading, refetch} = useFetchAllCustomListsQuery({
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

  const onListActionSheetSuccess = () => {
    actionSheetRef?.current?.close();
    setCurrentPage(1);
    refetch();
  };

  const renderItem = useCallback(
    ({item, index}: {item: ListItemInterface; index: number}) => {
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
          {index === 1 ? <View style={styles.seprator} /> : null}
        </>
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={allCustomLists?.list || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{gap: 10}}
        contentContainerStyle={{gap: 16}}
        ListFooterComponent={
          <View style={{marginBottom: verticalScale(150)}} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
      <ListActionsSheet
        ref={actionSheetRef}
        from="customLists"
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
        selectedListId={selectedList || ''}
        onSuccess={onListActionSheetSuccess}
      />
    </View>
  );
};

export default Lists;

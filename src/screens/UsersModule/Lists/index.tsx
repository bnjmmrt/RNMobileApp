/* eslint-disable react-native/no-inline-styles */
import { useScrollToTop } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import GradientSeprator from 'src/component/GradientSeprator';
import { useFetchAllCustomListsQuery } from 'src/redux/actions/listsApiAction';
import { RootState } from 'src/redux/slices';
import { setUsersTabAllListsRefresh, setUsersTabAllListsSkip } from 'src/redux/slices/listSkipSlice';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
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
  gender: string;
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
  totalCount: number;
  result: ListItemInterface[];
}
interface ListsProps { }

const Lists: React.FC<ListsProps> = ({ }) => {
  const styles = createStyle();
  const dispatch = useDispatch();
  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const scrollToTopRef = useRef(null);
  useScrollToTop(scrollToTopRef);
  const listTakeCount = 30;

  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<listActionCurrentPageType>('');
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string | null>(null);

  const { usersTabAllListsSkipCount, usersTabAllListRefresh } = useSelector((state: RootState) => {
    return {
      usersTabAllListsSkipCount: state?.listSkip?.usersTabAllListsSkipCount,
      usersTabAllListRefresh: state?.listSkip?.usersTabAllListRefresh,
    };
  }, shallowEqual);

  const { data, isLoading, refetch, isFetching } = useFetchAllCustomListsQuery({
    take: listTakeCount,
    skip: usersTabAllListsSkipCount,
  });

  const [isRendering, setRendring] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLoading) {
      setRendring(true); // immediately show skeleton loader
    } else {
      // Delay turning off the rendering state to avoid flicker
      timeoutId = setTimeout(() => {
        setRendring(false);
      }, 500); // you can tweak this delay
    }

    return () => {
      clearTimeout(timeoutId); // clean up if component unmounts or re-runs
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      dispatch(setUsersTabAllListsRefresh());
    };
  }, [usersTabAllListsSkipCount]);

  useEffect(() => {
    dispatch(setUsersTabAllListsSkip(0));
    refetch()
  }, [usersTabAllListRefresh])

  const loadMore = () => {
    if (
      !isLoading &&
      !isFetching &&
      usersTabAllListsSkipCount + listTakeCount < data?.data?.totalCount
    ) {
      dispatch(
        setUsersTabAllListsSkip(usersTabAllListsSkipCount + listTakeCount),
      );
    }
  };

  const onRefreshPage = () => {
    dispatch(setUsersTabAllListsRefresh());
  };

  const onListActionSheetSuccess = () => {
    dispatch(setUsersTabAllListsRefresh());
    actionSheetRef?.current?.close();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ListItemInterface; index: number }) => {
      return (
        <>
          <ListItem
            id={item.id}
            index={index}
            title={item.name}
            userCount={item.totalCount || 0}
            showDelete={index > 1}
            onPressDelete={() => {
              setSelectedList(item.id);
              setSelectedListName(item.name);
              setSelectedActionSheetAction('deleteList');
              actionSheetRef?.current?.open();
            }}
            listType={
              index === 0 ? 'follower' : index === 1 ? 'favorite' : 'custom'
            }
          />
          {data?.data?.result?.length > 2 && index === 1 ? (
            <GradientSeprator style={styles.seprator} />
          ) : null}
        </>
      );
    },
    [data?.data?.result],
  );

  const renderListSkeletonItem = (index: number) => {
    return (
      <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
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
      {isRendering && usersTabAllListsSkipCount === 0 ? (
        renderListSkeletonList()
      ) : (
        <FlatList
          ref={scrollToTopRef}
          data={data?.data?.result || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ gap: 10 }}
          contentContainerStyle={{ gap: 16 }}
          ListFooterComponent={
            (isLoading || isFetching) && usersTabAllListsSkipCount > 0 ? (
              <ActivityIndicator
                color={COLORS.black}
                style={{
                  marginTop: verticalScale(10),
                  marginBottom: verticalMarginScale(150),
                }}
              />
            ) : (
              <View style={{ marginBottom: verticalMarginScale(150) }} />
            )
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          refreshControl={
            data?.data?.result?.length > 0 ? (
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
        selectedListName={selectedListName || ''}
      />
    </View>
  );
};

export default Lists;

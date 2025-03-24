import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import { EventItem } from 'src/component/EventsFeed/EventsFeed';
import FeedItem from 'src/component/EventsFeed/FeedItem';
import { useFetchAllEventsQuery } from 'src/redux/actions/eventApiAction';
import { EVENT } from 'src/utils/constants';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import EventFilterSheet, { Filter } from '../../BottomSheets/EventFilterSheet';
import FilterBar from './FilterBar';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

interface UserEventsProps {
  user: string;
}

const filterData: Filter[] = [
  { label: 'All', value: 'CONFIRMED,INVITED,APPLIED,PAST,DECLINED' },
  { label: 'Upcoming', value: 'CONFIRMED' },
  { label: 'Past', value: 'PAST' },
  { label: 'Invited', value: 'INVITED' },
  { label: 'Requested', value: 'APPLIED' },
  { label: 'Declined', value: 'DECLINED' },
];

const UserEvents: React.FC<UserEventsProps> = ({ user }) => {
  const actionSheetRef = useRef<BottomSheetMethods>(null);

  const [allEvents, setAllEvents] = useState<{
    result: EventItem[];
    totalCount: number;
  }>({
    result: [],
    totalCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filterData[0]);

  const { userId } = useSelector(
    (state: RootState) => ({
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const { data, isLoading, error, isError, refetch } = useFetchAllEventsQuery({
    queryString: `guestEventStatus=${selectedFilter.value}&ownerId=${userId}`,
    userId: user,
    take: 10,
    skip: (currentPage - 1) * 10,
    isFeed: false,
  });

  const onPressApplyFilter = (filter: Filter) => {
    setCurrentPage(1);
    setSelectedFilter(filter);
    actionSheetRef?.current?.close();
  };

  const handleLoadMore = () => {
    if (allEvents?.result?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (data?.data?.result) {
      if (currentPage === 1) {
        setAllEvents(data.data);
      } else {
        setAllEvents(prev => ({
          totalCount: data.data.totalCount,
          result: [...prev.result, ...data?.data.result],
        }));
      }
    }
  }, [data, currentPage]);

  const renderItem = useCallback(({ item }: { item: EventItem }) => {
    return <FeedItem item={item} from="UserDetail" />;
  }, []);

  return (
    <View style={{ marginTop: verticalMarginScale(6), flex: 1 }}>
      <FilterBar
        selectedFilter={selectedFilter}
        onPressFilter={() => actionSheetRef?.current?.open()}
      />

      <FlatList
        data={allEvents?.result || []}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        numColumns={2}
        style={{
          marginHorizontal: horizontalMarginScale(12),
          marginTop: verticalMarginScale(20),
          height: Dimensions.get('window').height,
        }}
        columnWrapperStyle={{ gap: horizontalMarginScale(16) }}
        contentContainerStyle={{ gap: horizontalMarginScale(16) }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ marginBottom: verticalScale(300) }} />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Hp(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title={EVENT.USER_HAS_NO_EVENTS}
              isLoading={isLoading}
            />
          </View>
        }
        scrollEnabled={true}
        nestedScrollEnabled
        bounces={false}
      />

      <EventFilterSheet
        ref={actionSheetRef}
        filterData={filterData}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onPressSave={onPressApplyFilter}
      />
    </View>
  );
};

export default UserEvents;

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import {EventItem} from 'src/component/EventsFeed/EventsFeed';
import FeedItem from 'src/component/EventsFeed/FeedItem';
import {useFetchAllEventsQuery} from 'src/redux/actions/eventApiAction';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import EventFilterSheet, {Filter} from '../../BottomSheets/EventFilterSheet';
import FilterBar from './FilterBar';

interface UserEventsProps {
  user: string;
}

const filterData: Filter[] = [
  {label: 'Upcoming', value: 'UPCOMING'},
  {label: 'Invited', value: 'INVITED'},
  {label: 'Applied', value: 'APPLIED'},
  {label: 'Past', value: 'PAST'},
];

const UserEvents: React.FC<UserEventsProps> = ({user}) => {
  const actionSheetRef = useRef<BottomSheetMethods>(null);

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filterData[0]);

  const {data, isLoading, error, isError, refetch} = useFetchAllEventsQuery({
    queryString: `&guestEventStatus=${selectedFilter.value}`,
    userId: user,
  });

  const onPressApplyFilter = (filter: Filter) => {
    setSelectedFilter(filter);
    actionSheetRef?.current?.close();
  };

  const handleLoadMore = useCallback(() => {
    // if (pagination.skip < allEvents.length) {
    //   setPagination(prev => ({...prev, skip: prev.skip + prev.take}));
    // }
  }, [allEvents]);

  useEffect(() => {
    if (data) {
      const eventsRes = data?.data;
      setAllEvents(eventsRes);
    }
  }, [data]);

  const renderItem = useCallback(({item}: {item: EventItem}) => {
    return <FeedItem item={item} from="UserDetail" />;
  }, []);

  return (
    <View style={{marginTop: verticalMarginScale(6)}}>
      <FilterBar
        selectedFilter={selectedFilter}
        onPressFilter={() => actionSheetRef?.current?.open()}
      />

      <FlatList
        data={allEvents || []}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        style={{
          marginHorizontal: horizontalMarginScale(12),
          marginTop: verticalMarginScale(20),
        }}
        columnWrapperStyle={{gap: horizontalMarginScale(16)}}
        contentContainerStyle={{gap: horizontalMarginScale(16)}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{marginBottom: verticalScale(50)}} />}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="User has no events"
              isLoading={isLoading}
            />
          </View>
        }
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

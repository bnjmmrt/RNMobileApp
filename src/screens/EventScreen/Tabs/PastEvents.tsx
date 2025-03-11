import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import {
  useFetchEventsQuery,
  useFetchHostEventsQuery,
} from '../../../redux/actions/eventApiAction';
import EventItem from '../EventItem';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import { Hp } from '../../../utils/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { ROLE } from 'src/utils/constants';

interface PastEventsProps {
  userId: string;
  searchText: string;
  tab: any;
}

const PastEvents: React.FC<PastEventsProps> = ({ userId, searchText, tab }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const role = useSelector((state: RootState) => state.auth.role);

  const useFetchEvents =
    role === ROLE.HOST ? useFetchHostEventsQuery : useFetchEventsQuery;

  // Ensure argument structure remains consistent
  const queryArgs =
    role === ROLE.HOST
      ? ({
        status: 'PAST_STATUS',
        searchText,
        take: 10,
        skip: (currentPage - 1) * 10,
      } as const) // Type assertion to prevent union mismatch
      : ({
        userId,
        guestEventStatus: 'PAST',
        searchText,
        take: 10,
        skip: (currentPage - 1) * 10,
      } as const); // Type assertion

  const { data, isLoading, refetch } = useFetchEvents(queryArgs);

  // const { data, isLoading } = useFetchEventsQuery({
  //   userId,
  //   guestEventStatus: 'PAST',
  //   searchText: searchText,
  //   take: 10,
  //   skip: (currentPage - 1) * 10,
  // });


  useEffect(() => {
    if (data) {
      if (role === ROLE.HOST) {
        setEvents(prev =>
          currentPage === 1
            ? data.data.eventsResponse
            : // ? data.data
            [...prev, ...data.data.eventsResponse],
        );
      } else {
        setEvents(prev =>
          currentPage === 1 ? data.data.data : [...prev, ...data.data.data],
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);


  useEffect(() => {
    setRefreshing(isLoading);
  }, [isLoading]);

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch()
  };

  useEffect(() => {
    refetch()
  }, [currentPage])

  const loadMore = () => {
    if (events?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
      {events?.length > 0 ? (
        <FlatList
          data={events}
          style={{ paddingBottom: 10, paddingHorizontal: 15 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <EventItem item={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && <ActivityIndicator />}
        />
      ) : (
        <View
          style={{
            height: Hp(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <EventEmptyRecord
            title={tab.title}
            subTitle={tab.subTitle}
            isLoading={isLoading}
          />
        </View>
      )}
    </View>
  );
};

export default PastEvents;

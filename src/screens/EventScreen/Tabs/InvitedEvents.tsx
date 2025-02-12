import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useFetchAllEventsQuery, useFetchEventsQuery } from '../../../redux/actions/eventApiAction';
import EventItem from '../EventItem';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import { Hp } from '../../../utils/dimensions';

interface InvitedEventsProps {
  userId: string;
  searchText: string;
  tab: any;
}

const InvitedEvents: React.FC<InvitedEventsProps> = ({ userId, searchText, tab }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  // const { data, isLoading } = useFetchEventsQuery({
  //   userId,
  //   guestEventStatus: 'INVITED',
  //   searchText: searchText,
  //   take: 10,
  //   skip: (currentPage - 1) * 10,
  // });

  const { data, isLoading } = useFetchAllEventsQuery({ userId });



  useEffect(() => {
    if (data) {
      setEvents((prev) => (currentPage === 1 ? data.data : [...prev, ...data.data]));
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(isLoading)
  }, [isLoading])

  const handleRefresh = () => {
    setCurrentPage(1)
  };

  const loadMore = () => {
    if (data?.currentPage < data?.totalPages && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
      {events.length > 0 ? (
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
        <View style={{ height: Hp(55), alignItems: 'center', justifyContent: 'center' }}>
          <EventEmptyRecord title={tab.title} subTitle={tab.subTitle} isLoading={isLoading} />
        </View>
      )}
    </View>
  );
};

export default InvitedEvents;

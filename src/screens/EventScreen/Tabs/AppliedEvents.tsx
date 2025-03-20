import { useScrollToTop } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import { useFetchEventsQuery } from '../../../redux/actions/eventApiAction';
import { Hp, verticalMarginScale } from '../../../utils/dimensions';
import EventItem from '../EventItem';

interface AppliedEventsProps {
  userId: string;
  searchText: string;
  tab: any;
}

const AppliedEvents: React.FC<AppliedEventsProps> = ({
  userId,
  searchText,
  tab,
}) => {
  const scrollToTopRef = useRef(null);
  useScrollToTop(scrollToTopRef);

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const { data, isLoading } = useFetchEventsQuery({
    userId,
    guestEventStatus: 'APPLIED',
    searchText: searchText,
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  useEffect(() => {
    if (data) {
      setEvents(prev =>
        currentPage === 1 ? data.data.result : [...prev, ...data.data.result],
      );
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(isLoading);
  }, [isLoading]);

  const handleRefresh = () => {
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (events?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
      {events?.length > 0 ? (
        <FlatList
          ref={scrollToTopRef}
          data={events}
          style={{ paddingBottom: 10, paddingHorizontal: 15 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <EventItem item={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View style={{ marginBottom: verticalMarginScale(100) }}>
              {isLoading ? <ActivityIndicator /> : null}
            </View>
          }
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

export default AppliedEvents;

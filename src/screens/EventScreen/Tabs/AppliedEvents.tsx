import { useScrollToTop } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import { useFetchEventsQuery } from '../../../redux/actions/eventApiAction';
import { Hp, verticalMarginScale } from '../../../utils/dimensions';
import EventItem from '../EventItem';
import { COLORS } from 'src/utils/constants';
import EventItemSkeleton from '../../../component/EventItemSkeleton';
import { gridStyles, numColumns, isIPad } from './config';

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
  const { data, isLoading, refetch } = useFetchEventsQuery({
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
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const loadMore = () => {
    if (events?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && !events?.length ? (
        <FlatList
          data={[1, 2, 3]} // Show 3 skeleton items
          style={[styles.list, gridStyles.list]}
          keyExtractor={item => `skeleton-${item}`}
          renderItem={() => <EventItemSkeleton />}
          numColumns={numColumns}
          columnWrapperStyle={isIPad ? gridStyles.columnWrapper : undefined}
        />
      ) : events?.length > 0 ? (
        <FlatList
          ref={scrollToTopRef}
          data={events}
          style={[styles.list, gridStyles.list]}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={isIPad ? gridStyles.itemContainer : undefined}>
              <EventItem item={item} />
            </View>
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          numColumns={numColumns}
          columnWrapperStyle={isIPad ? gridStyles.columnWrapper : undefined}
          ListFooterComponent={
            <View style={styles.footer}>
              {isLoading ? <ActivityIndicator color={COLORS.black} /> : null}
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  footer: {
    marginBottom: verticalMarginScale(100),
  },
  emptyContainer: {
    height: Hp(55),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppliedEvents;

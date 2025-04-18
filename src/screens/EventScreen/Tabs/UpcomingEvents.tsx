import { useScrollToTop } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import {
  useFetchEventsQuery,
  useFetchHostEventsQuery,
} from '../../../redux/actions/eventApiAction';
import { COLORS, ROLE } from '../../../utils/constants';
import {
  Hp,
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  verticalScale,
  fontScale,
} from '../../../utils/dimensions';
import EventItem from '../EventItem';
import EventItemSkeleton from '../../../component/EventItemSkeleton';

interface UpcomingEventsProps {
  userId: string;
  searchText: string;
  tab: any;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  userId,
  searchText,
  tab,
}) => {
  const scrollToTopRef = useRef(null);
  useScrollToTop(scrollToTopRef);

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const role = useSelector((state: RootState) => state.auth.role);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const useFetchEvents =
    role === ROLE.HOST ? useFetchHostEventsQuery : useFetchEventsQuery;

  // Ensure argument structure remains consistent
  const queryArgs =
    role === ROLE.HOST
      ? ({
        status: 'UPCOMING_STATUS',
        searchText,
        take: 10,
        skip: (currentPage - 1) * 10,
        sortBy: 'startDate',
        order: 'ASC'
      } as const)
      : ({
        userId,
        guestEventStatus: 'UPCOMING',
        searchText,
        take: 10,
        skip: (currentPage - 1) * 10,
        sortBy: 'startDate',
        order: 'ASC'
      } as const);

  const { data, isLoading, refetch } = useFetchEvents(queryArgs as any);

  useEffect(() => {
    if (data) {
      if (role === ROLE.HOST) {
        setEvents(prev =>
          currentPage === 1 ? data.data.result : [...prev, ...data.data.result],
        );
        setIsDataLoading(false);
      } else {
        setEvents(prev =>
          currentPage === 1 ? data.data.result : [...prev, ...data.data.result],
        );
        setIsDataLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, currentPage, role]);

  useEffect(() => {
    setRefreshing(isLoading);
  }, [isLoading]);

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch();
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadMore = () => {
    if (events?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {isDataLoading && (
        <FlatList
          data={[1, 2, 3]} // Show 3 skeleton items
          style={styles.list}
          keyExtractor={item => `skeleton-${item}`}
          renderItem={() => <EventItemSkeleton />}
        />
      )}

      {events?.length > 0 && !isDataLoading && (
        <FlatList
          ref={scrollToTopRef}
          data={events}
          style={styles.list}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <EventItem item={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View style={styles.footer}>
              {isLoading ? <ActivityIndicator color={COLORS.black} /> : null}
            </View>
          }
        />
      )}

      {!isDataLoading && !events?.length && (
        <View style={styles.emptyContainer}>
          {searchText == '' ? (
            <EventEmptyRecord
              title={tab.title}
              subTitle={tab.subTitle}
              isLoading={isLoading}
            />
          ) : (
            <EventEmptyRecord
              title={tab.title}
              subTitle={'Please refine your search'}
              isLoading={isLoading}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  list: {
    paddingBottom: 10,
    paddingHorizontal: 15,
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

export default UpcomingEvents;

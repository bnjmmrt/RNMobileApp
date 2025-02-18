import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {
  useFetchEventsQuery,
  useFetchHostEventsQuery,
} from '../../../redux/actions/eventApiAction';
import EventItem from '../EventItem';
import EventEmptyRecord from '../../../component/EmptyRecord/EventEmptyRecord';
import {BUTTON_LABLE, COLORS, ROLE} from '../../../utils/constants';
import {Hp} from '../../../utils/dimensions';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';

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
          status: 'UPCOMING_STATUS',
          searchText,
          take: 10,
          skip: (currentPage - 1) * 10,
        } as const) // Type assertion to prevent union mismatch
      : ({
          userId,
          guestEventStatus: 'UPCOMING',
          searchText,
          take: 10,
          skip: (currentPage - 1) * 10,
        } as const); // Type assertion

  const {data, isLoading} = useFetchEvents(queryArgs);

  useEffect(() => {
    if (data) {
      if (role === ROLE.HOST) {
        setEvents(prev =>
          currentPage === 1
            ? data.data.eventsResponse
            : [...prev, ...data.data.eventsResponse],
        );
      } else {
        setEvents(prev =>
          currentPage === 1 ? data.data : [...prev, ...data.data],
        );
      }
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(isLoading);
  }, [isLoading]);

  const handleRefresh = () => {
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (data?.currentPage < data?.totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
      {events?.length > 0 ? (
        <FlatList
          data={events}
          style={{paddingBottom: 10, paddingHorizontal: 15}}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({item}) => <EventItem item={item} />}
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

export default UpcomingEvents;

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, FlatList } from 'react-native';
import { COLORS } from '../../utils/constants';
import HeaderComponent from '../../component/HeaderComponent';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import { StyleSheet } from 'react-native';
import { fontFamily, retrieveData } from '../../utils/functions';
import FeedItem from './FeedItem';
import dayjs from 'dayjs';
import NoResults from './NoResults';
import { apiGet } from '../../ApiManager/MainApi';
import FeedSearchInput from './FeedSearchInput';
import FeedAccessLocation from './FeedAccessLocation';
import FeedFilter from './FeedFilter';
import LocationPickerModal from '../BottomSheet/LocationPickerModal';
import FeedDetail from './FeedDetail';
import IMAGES from '@images/index';
import FeedSeries from './FeedSeries';
import FeedSeriesDetail from './FeedSeriesDetail';
import FeedFilterItem from './FeedFilterItem';
import type { DateType } from 'react-native-ui-datepicker';
import { Address } from '../../redux/slices/appFlowSlice';
import FeaturedFeedItem from './FeaturedFeedItem';
import {
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  verticalScale,
  radiusScale,
  fontScale,
  Hp,
  Wp,
} from '../../utils/dimensions';

export interface EventItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  location: string;
  image: string;
}

export interface SeriesItem {
  title: string;
  image: { uri: string };
  about: string;
  period: string;
  events: EventItem[];
}

export interface Filter {
  location: Address;
  categories: string[];
  date: [DateType, DateType];
}

export interface Pagination {
  take: number;
  skip: number;
}

const EventsFeed = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [allEvents, setAllEvents] = useState<(EventItem & SeriesItem)[]>([]);
  const [events, setEvents] = useState<(EventItem & SeriesItem)[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchEnter, setSearchEnter] = useState<boolean>(true);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);
  const [allowAccessModal, setAllowAccessModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [seriesDetail, setSeriesDetail] = useState<SeriesItem | null>(null);
  const [responseSubmitted, setResponseSubmitted] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({ take: 7, skip: 0 });
  const [filter, setFilter] = useState<Filter>({
    location: { address: '', placeId: '', latitude: '', longitude: '' },
    categories: [],
    date: ['', ''],
  });

  const isInvited = loginData?.isInvited || false;

  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchEnter(searchTerm === '');

    setEvents(
      allEvents.filter(value =>
        value.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, allEvents]);

  const handleClear = useCallback(() => {
    setSearchEnter(true);
    setEvents(allEvents);
  }, [allEvents]);

  const handleFilter = useCallback(() => {
    if (allowAccess) setFilterVisible(true);
    else setAllowAccessModal(true);
  }, []);

  const handleNotify = useCallback(() => {
    setResponseSubmitted(true);
    setTimeout(() => {
      setResponseSubmitted(false);
    }, 3000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.skip < allEvents.length) {
      setPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
    }
  }, [allEvents]);

  useEffect(() => {
    console.log('~~pagination~~', pagination);
    setEvents(prev => [
      ...prev,
      ...allEvents.slice(pagination.skip, pagination.skip + pagination.take),
    ]);
  }, [pagination.skip]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res: any = await apiGet(
          `/events/users/${loginData.id}/events?minStartDate=${filter.date[0] ? dayjs(filter.date[0]).format('YYYY-MM-DD') : ''
          }&maxEndDate=${filter.date[1] ? dayjs(filter.date[1]).format('YYYY-MM-DD') : ''
          }&longitude=${filter.location.longitude}&latitude=${filter.location.latitude
          }&eventTypeName=${filter.categories.join(',')}`,
        );

        const eventsRes = res.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          type: item.name,
          location: item?.location?.location || '',
          image: item.imageCover || item.imageFlyer,
        }));

        const featuredEventsRes = res.data
          .filter((item: any) => item.featuredEventSection)
          .map((item: any) => ({
            id: item.id,
            title: item.name,
            startDate: item.startDate,
            endDate: item.endDate,
            type: item.name,
            location: item?.location?.location || '',
            image: item.imageCover || item.imageFlyer,
          }));

        setFeaturedEvents(featuredEventsRes);
        setEvents([
          // {
          //   title: 'Lakers Season 2025',
          //   image: IMAGES.eventCoverPlaceholders,
          //   about:
          //     'The highly anticipated Revolve Festival officially kicks off the 2023 Coachella festival season in spectacular style, drawing attention from music and fashion enthusiasts alike. This iconic event makes a show-stopping return to the desert, delivering its most extravagant and memorable celebration yet. With a lineup of star-studded performances, exclusive experiences, and cutting-edge fashion moments, Revolve Festival solidifies its place as a must-attend event, setting the tone for an unforgettable festival season.',
          //   period: 'Jan 10 - May 20, 2025',
          //   events: eventsRes,
          // },
          ...eventsRes.slice(0, pagination.take),
        ]);
        setAllEvents(eventsRes);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  useEffect(() => {
    const formatAllowAccess = async () => {
      try {
        const allow = await retrieveData('allowAccess');
        setAllowAccess(allow && allow === 'true' ? true : false);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    formatAllowAccess();
  }, []);

  return (
    <View style={styles.container}>
      {isInvited ? (
        <BeforeAppStaticComponent isChatScreen={false} />
      ) : (
        <View>
          <HeaderComponent isDarkTheme={false} />
          <FeedSearchInput
            handleChange={handleSearchChange}
            handleSearch={handleSearch}
            handleClear={handleClear}
            handleFilter={handleFilter}
            filterLength={
              filter.categories.length +
              (filter.location.address ? 1 : 0) +
              (filter.date[0] && filter.date[1] ? 1 : 0)
            }
          />
          {(filter.categories.length > 0 ||
            filter.location.address ||
            filter.location.placeId ||
            filter.location.longitude ||
            filter.location.latitude ||
            (filter.date[0] && filter.date[1])) && (
              <ScrollView horizontal style={styles.filterScrollView}>
                <FeedFilterItem
                  content={filter.location.address}
                  handleClear={() =>
                    setFilter(prev => ({
                      ...prev,
                      location: {
                        address: '',
                        placeId: '',
                        longitude: '',
                        latitude: '',
                      },
                    }))
                  }
                />
                {filter.date[0] && filter.date[1] && (
                  <FeedFilterItem
                    content={`${dayjs(filter.date[0]).format(
                      'MMM DD, YYYY',
                    )} - ${dayjs(filter.date[1]).format('MMM DD, YYYY')}`}
                    handleClear={() =>
                      setFilter(prev => ({ ...prev, date: ['', ''] }))
                    }
                  />
                )}
                {filter.categories.map((category, categoryIndex) => (
                  <FeedFilterItem
                    content={category}
                    handleClear={() =>
                      setFilter(prev => ({
                        ...prev,
                        categories: prev.categories.filter(
                          cat => cat !== category,
                        ),
                      }))
                    }
                    key={categoryIndex}
                  />
                ))}
              </ScrollView>
            )}
          <View>
            {events.length === 0 ? (
              <NoResults loading={loading} />
            ) : (
              <FlatList
                data={events}
                ListHeaderComponent={
                  searchEnter && featuredEvents.length > 0 ? (
                    <View style={styles.featuredContainer}>
                      <Text style={styles.title}>Featured Events</Text>
                      <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                        {featuredEvents.map((event) => (
                          <FeaturedFeedItem
                            key={event.id}
                            item={event}
                            setDetail={setDetail}
                            isFeatured
                          />
                        ))}
                      </ScrollView>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => <FeedItem setDetail={setDetail} item={item} />}
                // renderItem={({ item }) =>
                //   item.events && searchEnter ? (
                //     <FeedSeries setSeries={setSeriesDetail} item={item} />
                //   ) : (
                //     <FeedItem setDetail={setDetail} item={item} />
                //   )
                // }
                numColumns={2}
                keyExtractor={(_item, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                style={styles.flatList}
              />
            )}
          </View>
        </View>
      )}

      {responseSubmitted && (
        <View style={styles.responseSubmitted}>
          <Image source={IMAGES.check1} style={styles.check1} />
          <Text style={styles.responseSubmittedText}>Response Submitted</Text>
        </View>
      )}

      <FeedSeriesDetail series={seriesDetail} setSeries={setSeriesDetail} />
      <FeedDetail
        detail={detail}
        setDetail={setDetail}
        handleNotify={handleNotify}
      />
      <FeedAccessLocation
        allowAccessModal={allowAccessModal}
        setAllowAccess={setAllowAccess}
        setAllowAccessModal={setAllowAccessModal}
        setFilterVisible={setFilterVisible}
      />
      <FeedFilter
        filter={filter}
        setFilter={setFilter}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
        setLocationVisible={setLocationVisible}
      />
      {locationVisible && (
        <LocationPickerModal
          setLocation={value => setFilter(prev => ({ ...prev, location: value }))}
          handleSubmit={setFilterVisible}
          setIsShown={setLocationVisible}
          submitVisible
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  featuredContainer: {
    flexDirection: 'column',
    paddingHorizontal: horizontalMarginScale(10),
    paddingVertical: verticalMarginScale(20),
    width: Wp(100),
    backgroundColor: COLORS.lighter_gray,
    // marginTop: verticalMarginScale(15),
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    lineHeight: 40,
    paddingLeft: horizontalMarginScale(12),
  },
  filterScrollView: {
    marginHorizontal: horizontalMarginScale(16),
    height: verticalScale(48),
  },
  flatList: {
    paddingBottom: verticalMarginScale(900),
  },
  scrollView: {
    height: verticalScale(390),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: verticalMarginScale(80),
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  eventContainer: {
    marginLeft: horizontalMarginScale(10),
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: verticalMarginScale(10),
  },
  logoImgStyle: {
    width: horizontalScale(100),
    height: verticalScale(50),
    resizeMode: 'center',
  },
  textBelowStyle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
  },
  responseSubmitted: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    bottom: 56,
    marginHorizontal: 'auto',
    height: horizontalScale(32),
    paddingHorizontal: horizontalMarginScale(6),
    paddingVertical: verticalMarginScale(6),
    borderRadius: radiusScale(6),
    backgroundColor: COLORS.grayMiddle,
  },
  responseSubmittedText: {
    color: COLORS.white,
  },
  check1: {
    width: horizontalScale(12),
    height: verticalScale(12),
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
  },
});

export default EventsFeed;

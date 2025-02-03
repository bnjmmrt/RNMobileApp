import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import {COLORS} from '../../utils/constants';
import HeaderComponent from '../../component/HeaderComponent';
import EventItem from '../../screens/EventScreen/EventItem';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/slices';
import {StyleSheet} from 'react-native';
import {Wp, Hp} from '../../utils/dimensions';
import {fontFamily} from '../../utils/functions';
import FeedItem from './FeedItem';
import NoResults from './NoResults';
import { apiGet } from '../../ApiManager/MainApi';
import FeedSearchInput from './FeedSearchInput';
import FeedAccessLocation from './FeedAccessLocation';
import FeedFilter from './FeedFilter';
import LocationPickerModal from '../BottomSheet/LocationPickerModal';
import {Address} from '../../redux/slices/appFlowSlice';
import FeedDetail from './FeedDetail';
import IMAGES from '@images/index';
import FeedSeries from './FeedSeries';
import FeedSeriesDetail from './FeedSeriesDetail';
import FeedFilterItem from './FeedFilterItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  image: {uri: string};
  about: string;
  period: string;
  events: EventItem[];
}

export interface Filter {
  location: string;
  categories: string[];
  date: [string, string];
}

const EventsFeed = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);

  const [allFilterEvents, setAllFilterEvents] = useState<EventItem[]>([]);
  const [filterEvents, setFilterEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchEnter, setSearchEnter] = useState<boolean>(true);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);
  const [allowAccessModal, setAllowAccessModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [seriesDetail, setSeriesDetail] = useState<SeriesItem | null>(null);
  const [filter, setFilter] = useState<Filter>({
    location: '',
    categories: [],
    date: ['', ''],
  });

  const isInvited = loginData?.isInvited || false;

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearch = () => {
    setSearchEnter(searchTerm === '');

    setFilterEvents(
      allFilterEvents.filter(value =>
        value.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const handleClear = () => {
    setSearchEnter(true);
    setFilterEvents(allFilterEvents);
  };

  const handleFilter = () => {
    if (allowAccess) setFilterVisible(true);
    else setAllowAccessModal(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res: any = await apiGet(
          `/events/feed?take=20&skip=0&startDate=${filter.date[0]}&endDate=${filter.date[1]}&findByCollaboratorLikeNameOrEmail=${searchTerm}`,
        );
        const featuredRes: any = await apiGet('/events/feed/featured');

        const eventsRes = res.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          type: item.name,
          location: item?.location?.location || '',
          image: item.imageCover || item.imageFlyer,
        }));

        const featuredEventsRes = featuredRes.data[0].events.map(
          (item: any) => ({
            id: item.id,
            title: item.name,
            startDate: item.startDate,
            endDate: item.endDate,
            type: item.name,
            location: item?.location?.location || '',
            image: item.imageCover || item.imagFlyer,
          }),
        );

        setFeaturedEvents(featuredEventsRes);
        setFilterEvents(eventsRes);
        setAllFilterEvents(eventsRes);

        setLoading(false);

        setSeries([
          {
            title: 'Lakers Season 2025',
            image: IMAGES.eventCoverPlaceholders,
            about:
              'The highly anticipated Revolve Festival officially kicks off the 2023 Coachella festival season in spectacular style, drawing attention from music and fashion enthusiasts alike. This iconic event makes a show-stopping return to the desert, delivering its most extravagant and memorable celebration yet. With a lineup of star-studded performances, exclusive experiences, and cutting-edge fashion moments, Revolve Festival solidifies its place as a must-attend event, setting the tone for an unforgettable festival season.',
            period: 'Jan 10 - May 20, 2025',
            events: eventsRes,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, [filter]);

  useEffect(() => {
    const formatAllowAccess = async () => {
      const allow = await AsyncStorage.getItem('allowAccess');
      setAllowAccess(allow === '1');
    };

    formatAllowAccess();
  }, []);

  return (
    <View
      style={[
        styles.container,
      ]}>
      {!isInvited ? (
        <BeforeAppStaticComponent
          isChatScreen={false}
        // title={LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS}
        // subTitle={LABLE.GET_DISCOVERY_BY_THE_WORLD}
        />
      ) : (
        <View>
          <HeaderComponent isDarkTheme={false} />
          <FeedSearchInput
            handleChange={handleSearchChange}
            handleSearch={handleSearch}
            handleClear={handleClear}
            handleFilter={handleFilter}
          />
          {(filter.categories.length > 0 ||
            filter.location ||
            filter.date[0] ||
            filter.date[1]) && (
            <ScrollView horizontal style={styles.filterScrollView}>
              <FeedFilterItem
                content={filter.location}
                handleClear={() => setFilter(prev => ({...prev, location: ''}))}
              />
              <FeedFilterItem
                content={`${filter.date[0]} - ${filter.date[1]}`}
                handleClear={() =>
                  setFilter(prev => ({...prev, date: ['', '']}))
                }
              />
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
          <ScrollView>
            {filterEvents.length === 0 ? (
              <NoResults loading={loading} />
            ) : (
              <>
                {searchEnter && (
                  <View style={styles.featuredContainer}>
                    <Text style={styles.title}>Featured Events</Text>
                    <ScrollView horizontal style={styles.scrollView}>
                      {featuredEvents.map((event, index) => (
                        <FeedItem
                          key={index}
                          item={event}
                          setDetail={setDetail}
                          isFeatured
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.eventContainer}>
                  {searchEnter &&
                    series.map((entry, entryIndex) => (
                      <FeedSeries
                        setSeries={setSeriesDetail}
                        item={entry}
                        key={entryIndex}
                      />
                    ))}
                  {filterEvents.map((value, index) => (
                    <FeedItem setDetail={setDetail} item={value} key={index} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.responseSubmitted}>
        <Image source={IMAGES.check1} style={styles.check1} />
        <Text style={styles.responseSubmittedText}>Response Submitted</Text>
      </View>

      <FeedSeriesDetail series={seriesDetail} setSeries={setSeriesDetail} />

      <FeedDetail detail={detail} setDetail={setDetail} />

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
          setLocation={value =>
            setFilter(prev => ({...prev, location: value.address}))
          }
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
    padding: 10,
    width: Wp(100),
    backgroundColor: COLORS.lighter_gray,
    marginTop: 15,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    lineHeight: 40,
    paddingLeft: 12,
  },
  filterScrollView: {
    paddingVertical: 8,
    height: Hp(8),
  },
  scrollView: {
    height: Hp(41),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  eventContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 100,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logoImgStyle: {
    width: 100,
    height: 50,
    resizeMode: 'center',
  },
  textBelowStyle: {
    color: COLORS.light_gray,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
  },
  responseSubmitted: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    bottom: 56,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#000000BF',
  },
  responseSubmittedText: {
    color: 'white',
  },
  check1: {
    width: 16,
    height: 16,
  },
});

export default EventsFeed;

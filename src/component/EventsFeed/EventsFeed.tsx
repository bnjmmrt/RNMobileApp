import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import {COLORS, LABLE} from '../../utils/constants';
import {SafeAreaView} from 'react-native';
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
import {apiGet} from '../../ApiManager/MainApi';
import FeedSearchInput from './FeedSearchInput';
import FeedAccessLocation from './FeedAccessLocation';
import FeedFilter from './FeedFilter';
import LocationPickerModal from '../BottomSheet/LocationPickerModal';
import {Address} from '../../redux/slices/appFlowSlice';
import FeedDetail from './FeedDetail';
import IMAGES from '@images/index';
import FeedSeries from './FeedSeries';
import FeedSeriesDetail from './FeedSeriesDetail';

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
  short_description: string;
  full_description: string;
  period: string;
  events: EventItem[];
}

const EventsFeed = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);

  const [allFilterEvents, setAllFilterEvents] = useState<EventItem[]>([]);
  const [filterEvents, setFilterEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchEnter, setSearchEnter] = useState<boolean>(true);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [seriesDetail, setSeriesDetail] = useState<SeriesItem | null>(null);

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
    setAllowAccess(true);
  };

  const handleSubmit = () => {};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res: any = await apiGet('/events/feed');
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
            short_description:
              'The highly anticipated Revolve Festival officially kicks off the 2023 Coachella festival season in spectacular style, drawing attention from music and fashion enthusiasts alike. This iconic event makes a show-stopping return to the desert, delivering its most extravagant and memorable celebration yet. With a lineup of star-studded performances, exclusive experiences, and cutting-edge fashion moments, Revolve Festival solidifies its place as a must-attend event, setting the tone for an unforgettable festival season.',
            full_description:
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
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isInvited ? COLORS.black : COLORS.white},
      ]}>
      {isInvited ? (
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
        allowAccess={allowAccess}
        setAllowAccess={setAllowAccess}
        setFilterVisible={setFilterVisible}
      />

      <FeedFilter
        filters={filters}
        setFilters={setFilters}
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
        setLocationVisible={setLocationVisible}
        handleSubmit={handleSubmit}
      />

      {locationVisible && (
        <LocationPickerModal
          setLocation={setSelectedCity}
          setIsShown={setLocationVisible}
          submitVisible
        />
      )}
    </SafeAreaView>
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
  scrollView: {
    height: Hp(41),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black,
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

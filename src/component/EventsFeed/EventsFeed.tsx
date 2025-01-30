import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { COLORS, LABLE } from '../../utils/constants';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import EventItem from '../../screens/EventScreen/EventItem';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import FeaturedEvents from './FeaturedEvents';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import { StyleSheet } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import FeedItem from './FeedItem';
import NoResults from './NoResults';
import { apiGet } from '../../ApiManager/MainApi';
import FeedSearchInput from './FeedSearchInput';
import FeedAccessLocation from './FeedAccessLocation';
import FeedFilter from './FeedFilter';

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  image: string;
}

const EventsFeed = () => {
  const styles = EventsFeedStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const [allFilterEvents, setAllFilterEvents] = useState<EventItem[]>([]);
  const [filterEvents, setFilterEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchEnter, setSearchEnter] = useState<boolean>(true);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res: any = await apiGet('/events/feed');
        const featuredRes: any = await apiGet('/events/feed/featured');

        const eventsRes = res.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          date: item.startDate,
          type: item.name,
          location: item?.location?.location || '',
          image: item.imageCover || item.imageFlyer,
        }));

        const featuredEventsRes = featuredRes.data[0].events.map(
          (item: any) => ({
            id: item.id,
            title: item.name,
            date: item.startDate,
            type: item.name,
            location: item?.location?.location || '',
            image: item.imageCover || item.imagFlyer,
          }),
        );

        setFeaturedEvents(featuredEventsRes);
        setFilterEvents(eventsRes);
        setAllFilterEvents(eventsRes);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
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
          <ScrollView>
            {filterEvents.length === 0 ? (
              <NoResults loading={loading} />
            ) : (
              <>
                {searchEnter && <FeaturedEvents item={featuredEvents} />}
                {
                  <View style={styles.eventContainer}>
                    {filterEvents.map((value, index) => (
                      <FeedItem item={value} key={index} />
                    ))}
                  </View>
                }
              </>
            )}
          </ScrollView>
        </View>
      )}

      {allowAccess && (
        <FeedAccessLocation setAllowAccess={setAllowAccess} setFilterVisible={setFilterVisible} />
      )}
      <FeedFilter
        filterVisible={filterVisible}
        setFilterVisible={setFilterVisible}
      />
    </View>
  );
};

const EventsFeedStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: COLORS.white,
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
  });
};

export default EventsFeed;

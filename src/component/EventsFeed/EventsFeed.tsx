import React, {useState} from 'react';
import {View, FlatList, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BUTTON_LABLE, COLORS, LABLE} from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import {SafeAreaView} from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import EventItem from '../../screens/EventScreen/EventItem';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import FeaturedEvents from './FeaturedEvents';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/slices';
import {Platform, StyleSheet} from 'react-native';
import {Wp, Hp} from '../../utils/dimensions';
import {fontFamily} from '../../utils/functions';
import FeedItem from './FeedItem';
import NoResults from './NoResults';
// Define the type for navigation props
interface TabItem {
  id: string;
  label: string;
}

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
  const [isInvited, setInvited] = useState<boolean>(
    loginData?.isInvited || false,
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const events: EventItem[] = [
    {
      id: '1',
      title: 'Art Event',
      date: 'Fri, Apr 13, 9:00PM – 11:00PM EST',
      type: 'RSVP to See Location',
      location: 'Los Angeles, California',
      image: IMAGES.eventCoverPlaceholders,
    },
    {
      id: '2',
      title: 'Holiday Event',
      date: 'Fri, Apr 13, 9:00PM – 11:00PM EST',
      type: 'RSVP to See Location',
      location: 'Los Angeles, California',
      image: IMAGES.eventCoverPlaceholders1,
    },
    {
      id: '3',
      title: 'Revolve Festival',
      date: 'Fri, Apr 13, 9:00PM – 11:00PM EST',
      type: 'RSVP to See Location',
      location: 'Los Angeles, California',
      image: IMAGES.eventCoverPlaceholders,
    },
    {
      id: '4',
      title: 'Travel Event',
      date: 'Fri, Apr 13, 9:00PM – 11:00PM EST',
      type: 'RSVP to See Location',
      location: 'Los Angeles, California',
      image: IMAGES.eventCoverPlaceholders1,
    },
    {
      id: '5',
      title: 'Revolve Festival',
      date: 'Fri, Apr 13, 9:00PM – 11:00PM EST',
      type: 'RSVP to See Location',
      location: 'Los Angeles, California',
      image: IMAGES.eventCoverPlaceholders1,
    },
  ];

  const filterEvents = events.filter(value =>
    value.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isInvited ? COLORS.black : COLORS.white},
      ]}>
      {isInvited ? (
        <BeforeAppStaticComponent
          title={LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS}
          subTitle={LABLE.GET_DISCOVERY_BY_THE_WORLD}
        />
      ) : (
        <View>
          <HeaderComponent />
          <SearchInput handleChange={handleSearchChange} />
          <ScrollView>
            {filterEvents.length === 0 ? (
              <NoResults />
            ) : (
              <>
                {searchTerm === '' && <FeaturedEvents item={events} />}
                {
                  <View style={styles.eventContainer}>
                    {filterEvents.map((value, index) => {
                      return <FeedItem item={value} key={index} />;
                    })}
                  </View>
                }
              </>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const EventsFeedStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
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

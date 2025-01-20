import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import EventScreenStyle from './EventScreenStyle';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import EventItem from './EventItem';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import { useEvents } from '../../redux/hooks/useEvents';
import { useFetchEventsQuery } from '../../redux/actions/eventApiAction';
// Define the type for navigation props
interface EventScreenProps extends NativeStackScreenProps<any, any> { }
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
  image: string
}


const EventScreen: React.FC<EventScreenProps> = ({ navigation }) => {
  const styles = EventScreenStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const eventId = 'a2fdf281-e9e8-4df8-8549-337ba79dab5f'//loginData?.eventId;
  const guestEventStatus = 'INVITED'//loginData?.guestEventStatus;
  const { data, error, isLoading } = useFetchEventsQuery({ eventId, guestEventStatus });

  const [isInvited, setInvited] = useState<boolean>(loginData?.isInvited || false)
  const [events, setEvents] = useState([]);
  const tabsData: TabItem[] = [
    { id: '1', label: BUTTON_LABLE.UPCOMING },
    { id: '2', label: BUTTON_LABLE.INVITED },
    { id: '3', label: BUTTON_LABLE.APPLIED },
    { id: '4', label: BUTTON_LABLE.PAST },
  ];
  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);

  // const events: EventItem[] = [
  //   { id: '1', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders },
  //   { id: '2', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders1 },
  //   { id: '3', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders },
  //   { id: '4', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders1 },
  // ];


  useEffect(() => {
    console.log('eventScreen', data)
    console.log('isLoading', isLoading)
    data && setEvents(data.data)
  }, [data,isLoading]);


 useEffect(() => {
    console.log('myevents', events)
  }, [events]);

  // const fetchGuestEvents = async () => {
  //   const url = "https://dev.api.therumor.com/v1/events/guest/events/a2fdf281-e9e8-4df8-8549-337ba79dab5f?guestEventStatus=INVITED";

  //   try {
  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('Fetched Data:', data);
  //     // Handle the fetched data here

  //   } catch (error) {
  //     console.error('Error fetching guest events:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchGuestEvents();
  // }, []);







  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  console.log("Saabjsfbsahjfbdjhfdjsf===",events)
  return (
    
    <SafeAreaView style={[styles.container, {backgroundColor: isInvited ? COLORS.black : COLORS.white}]}>
     {isInvited ?
      <BeforeAppStaticComponent
        title={LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS}
        subTitle={LABLE.GET_DISCOVERY_BY_THE_WORLD} />
     :
     <View>
      <HeaderComponent isDarkTheme={false} />
      <SearchInput />
      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />
      <View style={styles.contentContainer}>
        {events.length>0 && <FlatList
          data={events}
          style={{ padding: 15}}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
             <EventItem item={item} />
          )}
        />}

      </View>
      </View>
      }

    </SafeAreaView>
  );
};

export default EventScreen;

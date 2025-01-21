import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
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
import { Text } from 'react-native';
import { Hp } from '../../utils/dimensions';
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
  const [guestEventStatus, setGuestEventStatus] = useState<string>('INVITED');

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

  useEffect(() => {
    data && setEvents(data.data)
  }, [data]);

  useEffect(() => {
    setGuestEventStatus(currentTab.label.toUpperCase())
  }, [currentTab])

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  return (

    <SafeAreaView style={[styles.container, { backgroundColor: isInvited ? COLORS.black : COLORS.white }]}>
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
            {!isLoading ? <FlatList
              data={events}
              style={{ padding: 15 }}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EventItem item={item} />
              )}
            /> :
              <View style={{ alignItems: 'center', justifyContent: 'center', height: Hp(58), flexDirection: 'row' }}>
                <ActivityIndicator />
                {/* <Text style={styles.textBelowStyle}>Loading...</Text> */}
              </View>

            }

          </View>
        </View>
      }

    </SafeAreaView>
  );
};

export default EventScreen;

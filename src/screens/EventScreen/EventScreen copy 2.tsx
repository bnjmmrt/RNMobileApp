import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import { useFetchEventsQuery } from '../../redux/actions/eventApiAction';
import EventScreenStyle from './EventScreenStyle';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import EventItem from './EventItem';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { Hp } from '../../utils/dimensions';
import EventEmptyRecord from '../../component/EmptyRecord/EventEmptyRecord';

interface EventScreenProps extends NativeStackScreenProps<any, any> { }

interface TabItem {
  id: string;
  label: string;
  title: string;
  subTitle: string;
}

const EventScreen: React.FC<EventScreenProps> = ({ navigation }) => {
  const styles = EventScreenStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const eventId = loginData?.eventId || 'a2fdf281-e9e8-4df8-8549-337ba79dab5f';
    const searchInputRef = useRef<any>(null);
    const [searchText, setSearchText] = useState('');

  const tabsData: TabItem[] = [
    { id: '1', label: BUTTON_LABLE.UPCOMING , title:'No Events Here', subTitle:'No upcoming events.' },
    { id: '2', label: BUTTON_LABLE.INVITED,  title:'No Events Here', subTitle:'No invitations yet.' },
    { id: '3', label: BUTTON_LABLE.APPLIED,  title:'No Events Here', subTitle:'You haven’t applied to any events yet.' },
    { id: '4', label: BUTTON_LABLE.PAST,  title:'No Events Here', subTitle:'No past events.' },
  ];

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);
  const [tabState, setTabState] = useState(
    tabsData.reduce((acc, tab) => {
      acc[tab.label] = { data: [], currentPage: 1, totalPages: 1, loading: false };
      return acc;
    }, {} as Record<string, { data: any[]; currentPage: number; totalPages: number; loading: boolean }>)
  );

  const handleSearchTextChange = (text : string) => {
    setSearchText(text); // Update state in the parent
    console.log('Search text from child:', text);
};
  // Fetch events when the tab or page changes
  const { data, error, isLoading } = useFetchEventsQuery({
    eventId,
    guestEventStatus: currentTab.label.toUpperCase(),

    // page: tabState[currentTab.label].currentPage,
  });

  // Handle the tab change
  useEffect(() => {
    if (data) {
      console.log('sayyed data',data)
      setTabState((prev) => ({
        ...prev,
        [currentTab.label]: {
          ...prev[currentTab.label],
          data: tabState[currentTab.label].currentPage === 1 ? data.data : [...prev[currentTab.label].data, ...data.data],
          totalPages: data.totalPages,
          loading: false,
        },
      }));
    }else{
      console.log('sayyed data not found',data)

    }
  }, [data, currentTab]);

  useEffect(() => {
    
    setTabState((prev) => ({
      ...prev,
      [currentTab.label]: { ...prev[currentTab.label], loading: true },
    }));
  }, [currentTab]);

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const loadMore = () => {
    const { currentPage, totalPages, loading } = tabState[currentTab.label];
    if (currentPage < totalPages && !loading) {
      setTabState((prev) => ({
        ...prev,
        [currentTab.label]: {
          ...prev[currentTab.label],
          currentPage: currentPage + 1,
        },
      }));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: loginData?.isInvited ? COLORS.black : COLORS.white },
      ]}
    >
      {loginData?.isInvited ? (
        <BeforeAppStaticComponent isChatScreen={false} showLogout={false}  />
      ) : (
        <View>
          <HeaderComponent isDarkTheme={false} />
          <SearchInput ref={searchInputRef} onSearchTextChange={handleSearchTextChange} />

          <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />
          <View style={styles.contentContainer}>
            {tabState[currentTab.label].data.length > 0 ? <FlatList
              data={tabState[currentTab.label].data}
              style={{ padding: 15 }}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => <EventItem item={item} />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              // ListFooterComponent={
              //   tabState[currentTab.label].loading ? (
              //     <ActivityIndicator style={{ marginVertical: 10 }} />
              //   ) : null
              // }
            /> :
              <View style={{ alignItems: 'center', justifyContent: 'center', height: Hp(50), flexDirection: 'row'}}>
              <EventEmptyRecord title= {currentTab.title} subTitle= {currentTab.subTitle}/>
              </View>
            }
            {isLoading &&   <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator />
              </View>}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EventScreen;

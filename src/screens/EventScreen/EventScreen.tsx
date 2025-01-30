import React, { useState, useRef, useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import EventScreenStyle from './EventScreenStyle';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { BUTTON_LABLE, COLORS } from '../../utils/constants';
import UpcomingEvents from './Tabs/UpcomingEvents';
import InvitedEvents from './Tabs/InvitedEvents';
import AppliedEvents from './Tabs/AppliedEvents';
import PastEvents from './Tabs/PastEvents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AfterAppStaticComponent from 'src/component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
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
  // const changeTextDebouncer = useCallback(debounce(handleSearchTextChange, 500), []);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      !loginData?.isInvited && changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.BLACK_SCHEME);

      return () => {
        // Optional cleanup when screen is unfocused
        changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
      };
    }, [])
  );

  const tabsData: TabItem[] = [
    { id: '1', label: BUTTON_LABLE.UPCOMING, title: 'No Events Here', subTitle: 'No upcoming events.' },
    { id: '2', label: BUTTON_LABLE.INVITED, title: 'No Events Here', subTitle: 'No invitations yet.' },
    { id: '3', label: BUTTON_LABLE.APPLIED, title: 'No Events Here', subTitle: 'You haven’t applied to any events yet.' },
    { id: '4', label: BUTTON_LABLE.PAST, title: 'No Events Here', subTitle: 'No past events.' },
  ];
  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[1]);


  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const renderTabContent = () => {
    switch (currentTab.label) {
      case BUTTON_LABLE.UPCOMING:
        return <UpcomingEvents eventId={eventId} searchText={searchText} />;
      case BUTTON_LABLE.INVITED:
        return <InvitedEvents eventId={eventId} searchText={searchText} />;
      case BUTTON_LABLE.APPLIED:
        return <AppliedEvents eventId={eventId} searchText={searchText} />;
      case BUTTON_LABLE.PAST:
        return <PastEvents eventId={eventId} searchText={searchText} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {loginData?.isInvited ?
        <View style={{ backgroundColor: COLORS.white }}>
          <HeaderComponent isDarkTheme={false} />
          <SearchInput ref={searchInputRef} onSearchTextChange={handleSearchTextChange} />
          <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} activeTabIndex={loginData?.isInvited ? 1 : 0} />
          <View style={styles.contentContainer}>{renderTabContent()}</View>
        </View>
        :
        <AfterAppStaticComponent />

      }
    </View>
  );
};

export default EventScreen;

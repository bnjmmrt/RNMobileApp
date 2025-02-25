import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import AfterAppStaticComponent from 'src/component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import { RootState } from '../../redux/slices';
import {
  BUTTON_LABLE,
  COLORS,
  hostTabData,
  memberTabData,
} from '../../utils/constants';
import EventScreenStyle from './EventScreenStyle';
import AppliedEvents from './Tabs/AppliedEvents';
import InvitedEvents from './Tabs/InvitedEvents';
import PastEvents from './Tabs/PastEvents';
import UpcomingEvents from './Tabs/UpcomingEvents';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

interface EventScreenProps extends NativeStackScreenProps<any, any> {}

interface TabItem {
  id: string;
  label: string;
  title: string;
  subTitle: string;
}

const EventScreen: React.FC<EventScreenProps> = ({ navigation }) => {
  const styles = EventScreenStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);

  // const role =
  //   (loginData?.roles &&
  //     loginData?.roles.length > 0 &&
  //     loginData?.roles[0]?.roleName) ||
  //   'non_member';
  const searchInputRef = useRef<any>(null);
  const [searchText, setSearchText] = useState('');
  const showEvents = isGuest || role === 'member' || role === 'host';
  const tabs = role === 'host' ? hostTabData : memberTabData;

  useFocusEffect(
    useCallback(() => {
      showEvents
        ? changeSafeAreaViewConfig({
            ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
            showBottomSafeAreaView: false,
            showTopSafeAreaView: false,
          })
        : changeSafeAreaViewConfig({
            ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
            showBottomSafeAreaView: false,
            showTopSafeAreaView: false,
          });
    }, [loginData?.isInvited]),
  );

  const [currentTab, setCurrentTab] = useState<TabItem>(tabs[0]);

  const debouncedSearch = useCallback(
    debounce((text: string) => setSearchText(text), 500),
    [],
  );

  const handleSearchTextChange = (text: string) => {
    debouncedSearch(text);
  };

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const renderTabContent = () => {
    switch (currentTab.label) {
      case BUTTON_LABLE.UPCOMING:
        return (
          <UpcomingEvents
            userId={userId}
            searchText={searchText}
            tab={currentTab}
          />
        );
      case BUTTON_LABLE.INVITED:
        return (
          <InvitedEvents
            userId={userId}
            searchText={searchText}
            tab={currentTab}
          />
        );
      case BUTTON_LABLE.APPLIED:
        return (
          <AppliedEvents
            userId={userId}
            searchText={searchText}
            tab={currentTab}
          />
        );
      case BUTTON_LABLE.PAST:
        return (
          <PastEvents
            userId={userId}
            searchText={searchText}
            tab={currentTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: showEvents ? COLORS.white : COLORS.black2,
      }}>
      <SafeAreaView />
      {showEvents ? (
        <View
          style={{
            backgroundColor: COLORS.white,
            flex: 1,
            paddingBottom: 80,
          }}>
          <HeaderComponent isDarkTheme={false} />
          <SearchInput
            ref={searchInputRef}
            onSearchTextChange={handleSearchTextChange}
            mainContainerStyle={{
              marginHorizontal: horizontalMarginScale(20),
              marginBottom: verticalMarginScale(8),
            }}
          />
          <DynamicTabBar
            onTabChange={handleTabChange}
            tabs={tabs}
            activeTabIndex={isGuest ? 1 : 0}
          />
          <View style={styles.contentContainer}>{renderTabContent()}</View>
        </View>
      ) : (
        <AfterAppStaticComponent />
      )}
    </View>
  );
};

export default EventScreen;

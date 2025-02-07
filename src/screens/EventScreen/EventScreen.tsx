import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import AfterAppStaticComponent from 'src/component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import { RootState } from '../../redux/slices';
import { BUTTON_LABLE, COLORS, tabsData } from '../../utils/constants';
import EventScreenStyle from './EventScreenStyle';
import AppliedEvents from './Tabs/AppliedEvents';
import InvitedEvents from './Tabs/InvitedEvents';
import PastEvents from './Tabs/PastEvents';
import UpcomingEvents from './Tabs/UpcomingEvents';
import { horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';

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
  const role =
    (loginData?.roles &&
      loginData?.roles.length > 0 &&
      loginData?.roles[0]?.roleName) ||
    'non_member';
  const userId = loginData?.guestId || '6267f02a-0c86-4752-9e62-8bada629d830';
  const searchInputRef = useRef<any>(null);
  const [searchText, setSearchText] = useState('');
  const showEvents = loginData?.isInvited || role === 'member';

  useFocusEffect(
    useCallback(() => {
      showEvents
        ? changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
          showBottomSafeAreaView: false,
        })
        : changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
          showBottomSafeAreaView: false,
        });
    }, [loginData?.isInvited]),
  );

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[1]);

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
        return <UpcomingEvents userId={userId} searchText={searchText} />;
      case BUTTON_LABLE.INVITED:
        return <InvitedEvents userId={userId} searchText={searchText} />;
      case BUTTON_LABLE.APPLIED:
        return <AppliedEvents userId={userId} searchText={searchText} />;
      case BUTTON_LABLE.PAST:
        return <PastEvents userId={userId} searchText={searchText} />;
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
      {showEvents ? (
        <View
          style={{
            backgroundColor: COLORS.white,
            flex: 1,
            gap: verticalMarginScale(15),
          }}>
          <HeaderComponent isDarkTheme={false} />
          <SearchInput
            ref={searchInputRef}
            onSearchTextChange={handleSearchTextChange}
            mainContainerStyle={{ marginHorizontal: horizontalMarginScale(20) }}
          />
          <DynamicTabBar
            onTabChange={handleTabChange}
            tabs={tabsData}
            activeTabIndex={showEvents ? 1 : 0}
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

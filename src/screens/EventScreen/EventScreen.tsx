/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AfterAppStaticComponent from 'src/component/BeforeAppStaticComponent/AfterAppStaticComponent';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
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
  ROLE,
} from '../../utils/constants';
import EventScreenStyle from './EventScreenStyle';
import AppliedEvents from './Tabs/AppliedEvents';
import InvitedEvents from './Tabs/InvitedEvents';
import PastEvents from './Tabs/PastEvents';
import UpcomingEvents from './Tabs/UpcomingEvents';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { EndPoint } from 'src/ApiManager/config';
import { setIsGuest, setRole, setRoles } from 'src/redux/slices/authSlice';
import useApi from 'src/axios/useApi';

interface EventScreenProps extends NativeStackScreenProps<any, any> { }

interface TabItem {
  id: string;
  label: string;
  title: string;
  subTitle: string;
}

const EventScreen: React.FC<EventScreenProps> = ({ navigation }) => {
  const styles = EventScreenStyle();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);
  const roles = useSelector((state: RootState) => state.auth.roles);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const searchInputRef = useRef<any>(null);
  const [searchText, setSearchText] = useState('');
  const showEvents = isGuest || role === 'member' || role === 'host';
  const tabs = role === 'host' ? hostTabData : memberTabData;
  useFocusEffect(
    useCallback(() => {
      if (showEvents) {
        changeSafeAreaViewConfig(
          SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
        );
      }
    }, [showEvents]),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUserById = async () => {
  //       try {
  //         const response: any = await apiRequest(
  //           'post',
  //           EndPoint.get_user_with_role_by_id,
  //           { id: userId },
  //         );

  //         if (response.success) {
  //           const { roles, name , isGuest} = response.data;

  //           const transformedRoles = roles.map((role: any) => ({
  //             roleName: role.name,
  //             roleId: role.id,
  //           }));

  //           const isMember = transformedRoles.some(
  //             (role: role) => role.roleName === ROLE.MEMBER,
  //           );

  //           if (isMember) {
  //             // navigate(ROUTES.WelcomeScreen, { userName: name });
  //             dispatch(setRole(ROLE.MEMBER));
  //             dispatch(setRoles(transformedRoles));
  //           }else{
  //             dispatch(setIsGuest(isGuest || false))
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user:', error);
  //       }
  //     };

  //     if (roles.length > 1 && role === ROLE.NON_MEMBER) {
  //       fetchUserById();
  //     }
  //   }, [role, userId, roles]),
  // );

  const [currentTab, setCurrentTab] = useState<TabItem>(tabs[0]);

  const debouncedSearch = useCallback(
    debounce((text: string) => setSearchText(text), 500),
    [],
  );

  const handleSearchTextChange = (text: string) => {
    debouncedSearch(text);
  };

  const handleTabChange = (tab: TabItem) => {
    // setTimeout(()=>{
      setCurrentTab(tab);
    // },1000)
  };
  useFocusEffect(
    useCallback(() => {
      console.log('EventScreen mounted',role);
      handleTabChange(tabs[0])
    }, [role])
  )

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
      {showEvents ? (
        <View
          style={{
            paddingTop: TOP_SAFEAREA_SPACING,
          }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              flex: 1,
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

            <View style={{
              maxWidth: 526,
              marginHorizontal: 'auto',
            }}>
              <DynamicTabBar
                onTabChange={handleTabChange}
                tabs={tabs}
                activeTabIndex={isGuest ? 1 : 0}
                currentTab={currentTab}
              />
            </View>
            <View style={styles.contentContainer}>{renderTabContent()}</View>
          </View>
        </View>
      ) : (
        <AfterAppStaticComponent />
      )}
    </View>
  );
};

export default EventScreen;

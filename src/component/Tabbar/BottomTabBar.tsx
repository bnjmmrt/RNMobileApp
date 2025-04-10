import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ProfileStack } from '../../navigation/ProfileStack';
import { ROUTES } from '../../navigation/Route';
import { RootState } from '../../redux/slices';
import UsersModule from '../../screens/UsersModule';
import IMAGES from '../../assets/images';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';
import DiscoverScreen from '../../screens/DiscoverScreen/DiscoverScreen';
import EventScreen from '../../screens/EventScreen/EventScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import BottomTabBrComponent from './BottomTabBarComponent';
import { useGetUserStatus } from 'src/redux/hooks/useGetUserStatus';

const Tab = createBottomTabNavigator();

const memberTabs = [
  {
    name: 'DiscoverScreen',
    component: DiscoverScreen,
    options: { tabBarLabel: 'Discover', tabBarIcon: IMAGES.homeTab },
  },
  {
    name: 'EventScreen',
    component: EventScreen,
    options: { tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab },
  },
  {
    name: 'ChatScreen',
    component: ChatScreen,
    options: { tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab },
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
    options: { tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab },
  },
];

const hostTabs = [
  {
    name: 'EventScreen',
    component: EventScreen,
    options: { tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab },
  },
  {
    name: ROUTES.UsersScreen,
    component: UsersModule,
    options: { tabBarLabel: 'Users', tabBarIcon: IMAGES.usersTab },
  },
  {
    name: 'ChatScreen',
    component: ChatScreen,
    options: { tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab },
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
    options: { tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab },
  },
];

const BottomTabBar = () => {
  const { userStatusData } = useGetUserStatus();

  const { role, isGuest } = useSelector(
    (state: RootState) => ({
      role: state.auth.role,
      isGuest: state.auth.isGuest,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (userStatusData) {
      console.log('User Status Data:', userStatusData);
    }
  }, [userStatusData]);
  // const role =
  //   (loginData?.roles &&
  //     loginData?.roles.length > 0 &&
  //     loginData?.roles[0]?.roleName) ||
  //   'non_member';
  const bottomTabsData = role === 'host' ? hostTabs : memberTabs;
  const initialRouteName = role === 'host' ? 'EventScreen' : isGuest ? 'EventScreen' : 'DiscoverScreen';
  console.log('BottomTabBar role', role, 'isGuest', isGuest, 'initialRouteName', initialRouteName)

  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBrComponent {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
      initialRouteName={initialRouteName}
    //   initialRouteName
    // role === 'host' ? 'EventScreen' : 'DiscoverScreen'
    // loginData?.isInvited ? 'EventScreen' : 'DiscoverScreen'
    // ROUTES.UsersScreen
    // 'DiscoverScreen'
    //'EventScreen'
    // }
    >
      {bottomTabsData.map((item, index) => {
        return (
          <Tab.Screen
            key={item.name} // Use a unique value, like item.name or index
            name={item.name}
            component={item.component}
            options={item.options}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabBar;

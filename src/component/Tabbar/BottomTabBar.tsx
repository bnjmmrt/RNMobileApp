import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTabBrComponent from './BottomTabBarComponent';
import DiscoverScreen from '../../screens/DiscoverScreen/DiscoverScreen';
import IMAGES from '../../assets/images';
import EventScreen from '../../screens/EventScreen/EventScreen';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';
import UsersModule from 'src/screens/UsersModule';
import {SCREENS} from 'src/utils/constants';
import { ProfileStack } from '../../navigation/ProfileStack';

const Tab = createBottomTabNavigator();

const memberTabs = [
  {
    name: 'DiscoverScreen',
    component: DiscoverScreen,
    options: {tabBarLabel: 'Discover', tabBarIcon: IMAGES.homeTab},
  },
  {
    name: 'EventScreen',
    component: EventScreen,
    options: {tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab},
  },
  {
    name: 'ChatScreen',
    component: ChatScreen,
    options: {tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab},
  },
  {
    name: 'ProfileScreen',
    component: ProfileStack,
    options: {tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab},
  },
];

const hostTabs = [
  {
    name: 'EventScreen',
    component: EventScreen,
    options: {tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab},
  },
  {
    name: SCREENS.USERS_BOTTOM_TAB,
    component: UsersModule,
    options: {tabBarLabel: 'Users', tabBarIcon: IMAGES.profileTab},
  },
  {
    name: 'ChatScreen',
    component: ChatScreen,
    options: {tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab},
  },
  {
    name: 'ProfileScreen',
    component: ProfileStack,
    options: {tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab},
  },
];
// const hostTabs = [
//   {
//     name: 'EventScreen',
//     component: EventScreen,
//     options: {tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab},
//   },
//   {
//     name: SCREENS.USERS_BOTTOM_TAB,
//     component: UsersModule,
//     options: {tabBarLabel: 'Users', tabBarIcon: IMAGES.profileTab},
//   },
//   {
//     name: 'ChatScreen',
//     component: ChatScreen,
//     options: {tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab},
//   },
//   {
//     name: 'ProfileScreen',
//     component: ProfileScreen,
//     options: {tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab},
//   },
// ];

const BottomTabBar = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);


  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBrComponent {...props} />}
      screenOptions={{headerShown: false}}
      backBehavior="history"
      initialRouteName={loginData?.isInvited ? "EventScreen" : "DiscoverScreen"}>
      {memberTabs.map((item, index) => {
        return (
          <Tab.Screen
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

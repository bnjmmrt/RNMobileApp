import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {useSelector} from 'react-redux';
import {ProfileStack} from 'src/navigation/ProfileStack';
import {ROUTES} from 'src/navigation/Route';
import {RootState} from 'src/redux/slices';
import UsersModule from 'src/screens/UsersModule';
import IMAGES from '../../assets/images';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';
import DiscoverScreen from '../../screens/DiscoverScreen/DiscoverScreen';
import EventScreen from '../../screens/EventScreen/EventScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import BottomTabBrComponent from './BottomTabBarComponent';

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
    name: ROUTES.UsersScreen,
    component: UsersModule,
    options: {tabBarLabel: 'Users', tabBarIcon: IMAGES.usersTab},
  },
  {
    name: 'ChatScreen',
    component: ChatScreen,
    options: {tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab},
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
    options: {tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab},
  },
];

const BottomTabBar = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const role =
    (loginData?.roles &&
      loginData?.roles.length > 0 &&
      loginData?.roles[0]?.roleName) ||
    'non_member';
  const bottomTabsData = hostTabs; //role === 'host' ? hostTabs : memberTabs;
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBrComponent {...props} />}
      screenOptions={{headerShown: false}}
      backBehavior="history"
      initialRouteName={
        // role === 'host' ? 'EventScreen' : 'DiscoverScreen'
        // loginData?.isInvited ? 'EventScreen' : 'DiscoverScreen'
        // ROUTES.UsersScreen
        'EventScreen'
      }>
      {bottomTabsData.map((item, index) => {
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

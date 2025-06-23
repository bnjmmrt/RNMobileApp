import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ROUTES } from '../../navigation/Route';
import { RootState } from '../../redux/slices';
import UsersModule from '../../screens/UsersModule';
import IMAGES from '../../assets/images';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';
import DiscoverScreen from '../../screens/DiscoverScreen/DiscoverScreen';
import EventScreen from '../../screens/EventScreen/EventScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import BottomTabBrComponent from './BottomTabBarComponent';
import { ROLE } from '../../utils/constants';
import useApi from 'src/axios/useApi';
import { useNavigation } from '@react-navigation/native';

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

const CommunityGuidelinesChecker = () => {
  const navigation = useNavigation<any>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { role } = useSelector(
    (state: RootState) => ({
      role: state.auth.role,
    }),
    shallowEqual,
  );
  const { apiRequest } = useApi<any>();

  const checkCommunityGuidelinesStatus = async () => {
    try {
      const response: any = await apiRequest(
        'get',
        `users/v1/auth/user/${userId}/community-guidelines-status`,
      );
      return (response as any).data.agreed;
    } catch (error) {
      console.error('Error checking community guidelines status:', error);
      return false;
    }
  };

  const checkHostCommunityGuidelinesStatus = async () => {
    try {
      const response: any = await apiRequest(
        'get',
        `users/v1/auth/user/${userId}/host-community-guidelines-status`,
      );
      return (response as any).data.agreed;
    } catch (error) {
      console.error('Error checking host community guidelines status:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkGuidelines = async () => {
      if (!userId || role === ROLE.NON_MEMBER) {
        return;
      }

      try {
        let hasAgreed = false;

        if (role === ROLE.MEMBER) {
          hasAgreed = await checkCommunityGuidelinesStatus();
          if (!hasAgreed) {
            navigation.replace('CommunityGuidelinesScreen', { isHost: false });
            return;
          }
        } else if (role === ROLE.HOST) {
          hasAgreed = await checkHostCommunityGuidelinesStatus();
          if (!hasAgreed) {
            navigation.replace('CommunityGuidelinesScreen', { isHost: true });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking community guidelines:', error);
      }
    };

    checkGuidelines();
  }, [userId, role]);

  return <BottomTabBar />;
};

const BottomTabBar = () => {
  const { role, isGuest } = useSelector(
    (state: RootState) => ({
      role: state.auth.role,
      isGuest: state.auth.isGuest,
    }),
    shallowEqual,
  );

  const bottomTabsData = role === 'host' ? hostTabs : memberTabs;
  const initialRouteName =
    role === 'host'
      ? 'EventScreen'
      : isGuest
      ? 'EventScreen'
      : 'DiscoverScreen';

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

export default CommunityGuidelinesChecker;

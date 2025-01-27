import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTabBrComponent from './BottomTabBarComponent';
import DiscoverScreen from '../../screens/DiscoverScreen/DiscoverScreen';
import IMAGES from '../../assets/images';
import EventScreen from '../../screens/EventScreen/EventScreen';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
    // Move the useSelector hook here
    const loginData = useSelector((state: RootState) => state.auth.loginData);

    // Determine the initial screen dynamically
    const initialScreen = loginData?.isInvited ? 'EventScreen' : 'DiscoverScreen';

    return (
        <Tab.Navigator
            tabBar={props => <BottomTabBrComponent {...props} />}
            screenOptions={{ headerShown: false }}
            backBehavior="history"
            initialRouteName={initialScreen}>
            <Tab.Screen
                name="DiscoverScreen"
                component={DiscoverScreen}
                options={{ tabBarLabel: 'Discover', tabBarIcon: IMAGES.homeTab }}
            />
            <Tab.Screen
                name="EventScreen"
                component={EventScreen}
                options={{ tabBarLabel: 'Events', tabBarIcon: IMAGES.eventTab }}
            />
            <Tab.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{ tabBarLabel: 'Chat', tabBarIcon: IMAGES.chatTab }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile', tabBarIcon: IMAGES.profileTab }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabBar;

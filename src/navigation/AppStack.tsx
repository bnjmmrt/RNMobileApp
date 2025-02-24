import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import BeforeAppStaticScreen from '../screens/BeforeApplicationFlow/BeforeAppStaticScreen';
import { AppFlowStack } from './AppFlowStack';
import { ROUTES } from './Route';
import UserDetails from 'src/screens/UsersModule/UserDetails';
import ListDetails from 'src/screens/UsersModule/ListDetails';
import { ProfileStack } from './ProfileStack';
import { EventStack } from './EventStack';
import InviteReferralBottomSheet from 'src/component/InviteReferralBottomSheet/InviteReferralBottomSheet';
import WelcomeScreen from 'src/screens/AppFlow/WelcomeScreen/WelcomeScreen';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import EditEventDetails from 'src/screens/EventScreen/EditEventDetails';
import EditEventSettings from 'src/screens/EventScreen/EditEventSettings';
import EditEventScreen from 'src/screens/EventScreen/EditEventScreen';

export type customListType = 'follower' | 'favorite' | 'custom';
export type AppStackParamList = {
  [ROUTES.BeforeAppStaticScreen]: undefined;
  [ROUTES.BottomTabBar]: undefined;
  [ROUTES.AppFlowStack]: undefined;
  [ROUTES.UserDetail]: { user: string };
  [ROUTES.ListDetail]: {
    list: string;
    listType: customListType;
  };
  [ROUTES.ProfileStack]: undefined;
  [ROUTES.EventStack]: undefined;
  [ROUTES.WelcomeScreen]: undefined;
};

interface AppStackProps {
  initialRouteName?: keyof AppStackParamList;
}

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC<AppStackProps> = ({
  initialRouteName = 'BottomTabBar',
}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.BeforeAppStaticScreen}
        component={BeforeAppStaticScreen}
      />
      <Stack.Screen
        name="InviteReferralScreen"
        component={InviteReferralBottomSheet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.WelcomeScreen}
        component={WelcomeScreen}
      />
      <Stack.Screen name={ROUTES.AppFlowStack} component={AppFlowStack} />
      <Stack.Screen name={ROUTES.BottomTabBar} component={BottomTabBar} />
      <Stack.Screen name={ROUTES.ProfileStack} component={ProfileStack} />
      <Stack.Screen name={ROUTES.EventStack} component={EventStack} />
      <Stack.Screen name={ROUTES.UserDetail} component={UserDetails} />
      <Stack.Screen name={ROUTES.ListDetail} component={ListDetails} />
      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EditEventScreen}
        component={EditEventScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

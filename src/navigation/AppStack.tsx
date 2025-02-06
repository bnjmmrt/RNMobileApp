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

export type AppStackParamList = {
  BeforeAppStaticScreen: undefined;
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  UserDetail: undefined;
  ListDetail: undefined;
  ProfileStack: undefined;
  EventStack: undefined;
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
      <Stack.Screen name={ROUTES.AppFlowStack} component={AppFlowStack} />
      <Stack.Screen name={ROUTES.BottomTabBar} component={BottomTabBar} />
      <Stack.Screen name={ROUTES.ProfileStack} component={ProfileStack} />
      <Stack.Screen name={ROUTES.EventStack} component={EventStack} />
      <Stack.Screen name={ROUTES.UserDetail} component={UserDetails} />
      <Stack.Screen name={ROUTES.ListDetail} component={ListDetails} />
    </Stack.Navigator>
  );
};

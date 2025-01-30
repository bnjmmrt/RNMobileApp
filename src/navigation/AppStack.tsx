import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppFlowStack } from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import BeforeAppStaticScreen from '../screens/BeforeApplicationFlow/BeforeAppStaticScreen';
import { AuthStack } from './AuthStack';
import { SCREENS } from 'src/utils/constants';

export type AppStackParamList = {
  BeforeAppStaticScreen: undefined;
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  AuthStack: undefined;
  [SCREENS.USER_DETAIL]: { user: number };
};

interface AppStackProps {
  initialRouteName?: keyof AppStackParamList;
}

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC<AppStackProps> = ({ initialRouteName = 'BeforeAppStaticScreen' }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BeforeAppStaticScreen" component={BeforeAppStaticScreen} />
      <Stack.Screen name="AppFlowStack" component={AppFlowStack} />
      <Stack.Screen name="BottomTabBar" component={BottomTabBar} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name={SCREENS.USER_DETAIL} component={AuthStack} />
    </Stack.Navigator>
  );
};

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppFlowStack } from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';


// Define the param list for the stack navigator
export type OnboardingStackkParamList = {
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  EventDetailsScreen: undefined;
};

const Stack = createStackNavigator<OnboardingStackkParamList>();

export const OnboardingStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTabBar"
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="AppFlowStack"
        component={AppFlowStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BottomTabBar"
        component={BottomTabBar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen/LandingScreen';
import EmailPhoneScreen from '../screens/EmailPhoneScreen/EmailPhoneScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen/VerifyOtpScreen';
import { AppStack } from './AppStack';
import { OnboardingStack } from './OnboardingStack';
import BeforeAppStaticScreen from 'src/screens/BeforeApplicationFlow/BeforeAppStaticScreen';
import { AppFlowStack } from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';


// Define the param list for the stack navigator
export type AuthStackParamList = {
  LandingScreen: undefined;
  EmailPhoneScreen: undefined;
  VerifyOtpScreen: undefined;
  BottomTabBar: undefined;
  BeforeAppStaticScreen: undefined;
  AppFlowStack: undefined;
  EventDetailsScreen: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LandingScreen"
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailPhoneScreen"
        component={EmailPhoneScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VerifyOtpScreen"
        component={VerifyOtpScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BeforeAppStaticScreen"
        component={BeforeAppStaticScreen}
        options={{ headerShown: false }}
      />

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

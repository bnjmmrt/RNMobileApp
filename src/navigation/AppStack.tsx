import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppFlowStack } from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import BeforeAppStaticScreen from '../screens/BeforeApplicationFlow/BeforeAppStaticScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import ReferralScreen from 'src/screens/ProfileScreen/ReferralsScreen/ReferralScreen';
import FollowingScreen from 'src/screens/ProfileScreen/FollowingScreen/FollowingScreen';
import HostProfileScreen from 'src/screens/ProfileScreen/HostProfile/HostProfileScreen';
import { AuthStack } from './AuthStack';


// Define the param list for the stack navigator
export type AppStackParamList = {
  BeforeAppStaticScreen: undefined;
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  AuthStack: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={"BeforeAppStaticScreen"}
      screenOptions={({ route, navigation }) => ({})}>

      {/* <Stack.Screen
        name="BeforeAppStaticScreen"
        component={BeforeAppStaticScreen}
        options={{ headerShown: false }}
      /> */}
           <Stack.Screen
        name="HostProfileScreen"
        component={HostProfileScreen}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="ReferralsScreen"
        component={ReferralScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowingScreen"
        component={FollowingScreen}
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
        name="AuthStack"
        component={AuthStack}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

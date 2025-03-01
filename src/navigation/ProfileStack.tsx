import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfile/EditProfileScreen';
import ConnectedAccountsScreen from '../screens/ProfileScreen/EditProfile/ConnectedAccountsScreen';
import SelectInterestScreen from '../screens/AppFlow/SelectInterestScreen/SelectInterestScreen';
import NotificationsSettingsScreen from '../screens/ProfileScreen/EditProfile/Notifications';
import FeedbackScreen from '../screens/ProfileScreen/EditProfile/FeedbackScreen';
import HostProfileScreen from 'src/screens/ProfileScreen/HostProfile/HostProfileScreen';
import ReferralScreen from 'src/screens/ProfileScreen/ReferralsScreen/ReferralScreen';
import FollowingScreen from 'src/screens/ProfileScreen/FollowingScreen/FollowingScreen';
import HostEditProfileScreen from 'src/screens/ProfileScreen/EditProfile/HostEditProfileScreen';
import HostConnectedAccountsScreen from 'src/screens/ProfileScreen/EditProfile/HostConnectedAccountsScreen';


// Define the param list for the stack navigator
export type ProfileStackParamList = {
  EditProfileScreen: undefined;
  ProfileScreen: undefined;
  ConnectedAccountsScreen: undefined;
  SelectInterestScreen: undefined;
  NotificationsSettingsScreen: undefined;
  FeedbackScreen: undefined;
  HostProfileScreen: undefined;
  ReferralScreen: undefined;
  FollowingScreen: undefined;
  HostEditProfileScreen:undefined;
  HostConnectedAccountsScreen:undefined
};

const Stack = createStackNavigator<ProfileStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={"ProfileScreen"}
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConnectedAccountsScreen"
        component={ConnectedAccountsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SelectInterestScreen"
        component={SelectInterestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsSettingsScreen"
        component={NotificationsSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HostProfileScreen"
        component={HostProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReferralScreen"
        component={ReferralScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowingScreen"
        component={FollowingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HostEditProfileScreen"
        component={HostEditProfileScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="HostConnectedAccountsScreen"
        component={HostConnectedAccountsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

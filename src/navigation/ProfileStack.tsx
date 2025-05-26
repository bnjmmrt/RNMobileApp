import React, { useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { isIPad } from '../utils/isTabletConfig';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfile/EditProfileScreen';
import ConnectedAccountsScreen from '../screens/ProfileScreen/EditProfile/ConnectedAccountsScreen';
import SelectInterestScreen from '../screens/AppFlow/SelectInterestScreen/SelectInterestScreen';
import NotificationSettingsScreen from '../screens/ProfileScreen/EditProfile/NotificationSettingsScreen';
import FeedbackScreen from '../screens/ProfileScreen/EditProfile/FeedbackScreen';
import HostProfileScreen from 'src/screens/ProfileScreen/HostProfile/HostProfileScreen';
import ReferralScreen from 'src/screens/ProfileScreen/ReferralsScreen/ReferralScreen';
import FollowingScreen from 'src/screens/ProfileScreen/FollowingScreen/FollowingScreen';
import HostEditProfileScreen from 'src/screens/ProfileScreen/EditProfile/HostEditProfileScreen';
import HostConnectedAccountsScreen from 'src/screens/ProfileScreen/EditProfile/HostConnectedAccountsScreen';
import { ROUTES } from './Route';

// Define the param list for the stack navigator
export type ProfileStackParamList = {
  [ROUTES.ProfileScreen]: undefined;
  [ROUTES.EditProfileScreen]: undefined;
  [ROUTES.ConnectedAccountsScreen]: undefined;
  [ROUTES.SelectInterestScreen]: undefined;
  [ROUTES.NotificationSettingsScreen]: undefined;
  [ROUTES.FeedbackScreen]: undefined;
  [ROUTES.HostProfileScreen]: undefined;
  [ROUTES.ReferralScreen]: undefined;
  [ROUTES.FollowingScreen]: undefined;
  [ROUTES.HostEditProfileScreen]: undefined;
  [ROUTES.HostConnectedAccountsScreen]: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.ProfileScreen}
      screenOptions={({ route, navigation }) => ({
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}>
      <Stack.Screen
        name={ROUTES.ProfileScreen}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ROUTES.EditProfileScreen}
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ConnectedAccountsScreen}
        component={ConnectedAccountsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ROUTES.SelectInterestScreen}
        component={SelectInterestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.NotificationSettingsScreen}
        component={NotificationSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.FeedbackScreen}
        component={FeedbackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HostProfileScreen}
        component={HostProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ReferralScreen}
        component={ReferralScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.FollowingScreen}
        component={FollowingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.HostEditProfileScreen}
        component={HostEditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HostConnectedAccountsScreen}
        component={HostConnectedAccountsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

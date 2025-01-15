import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDetailsScreen from '../screens/AppFlow/MyDetails/MyDetails';
import EnterEmail from '../screens/AppFlow/EnterEmail/EnterEmail';
import VerifyEmail from '../screens/AppFlow/VerifyEmail/VerifyEmail';
import GenderScreen from '../screens/AppFlow/GenderScreen/GenderScreen';
import BirthdayScreen from '../screens/AppFlow/BirthdayScreen/BirthdayScreen';
import BaseCityScreen from '../screens/AppFlow/BaseCityScreen/BaseCityScreen';
import CreativeFocusScreen from '../screens/AppFlow/CreativeFocusScreen/CreativeFocusScreen';
import SelectInterestScreen from '../screens/AppFlow/SelectInterestScreen/SelectInterestScreen';
import ProfilePhotoScreen from '../screens/AppFlow/ProfilePhotoScreen/ProfilePhotoScreen';
import IdentityVerification from '../screens/AppFlow/IdentityVerification/IdentityVerification';


// Define the param list for the stack navigator
export type AppFlowStackParamList = {
  MyDetailsScreen: undefined;
  EnterEmail: undefined
};

const Stack = createStackNavigator<AppFlowStackParamList>();

export const AppFlowStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyDetailsScreen"
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="MyDetailsScreen"
        component={MyDetailsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EnterEmail"
        component={EnterEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GenderScreen"
        component={GenderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BirthdayScreen"
        component={BirthdayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BaseCityScreen"
        component={BaseCityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreativeFocusScreen"
        component={CreativeFocusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectInterestScreen"
        component={SelectInterestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePhotoScreen"
        component={ProfilePhotoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerification}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

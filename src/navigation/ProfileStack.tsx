import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfile/EditProfileScreen';


// Define the param list for the stack navigator
export type AppStackParamList = {
  EditProfileScreen: undefined;
  ProfileScreen: undefined;
  // AppFlowStack: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={ "ProfileScreen" }
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false}}
      />

    </Stack.Navigator>
  );
};

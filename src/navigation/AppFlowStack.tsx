import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDetailsScreen from '../screens/AppFlow/MyDetails/MyDetails';
import EnterEmail from '../screens/AppFlow/EnterEmail/EnterEmail';
import VerifyEmail from '../screens/AppFlow/VerifyEmail/VerifyEmail';


// Define the param list for the stack navigator
export type AppFlowStackParamList = {
  MyDetailsScreen: undefined;

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


    </Stack.Navigator>
  );
};

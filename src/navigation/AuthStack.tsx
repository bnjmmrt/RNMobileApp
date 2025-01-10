import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen/LandingScreen';
import EmailPhoneScreen from '../screens/EmailPhoneScreen/EmailPhoneScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen/VerifyOtpScreen';


// Define the param list for the stack navigator
export type AuthStackParamList = {
  LandingScreen: undefined;
  EmailPhoneScreen: undefined;
  VerifyOtpScreen: undefined;
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

    </Stack.Navigator>
  );
};

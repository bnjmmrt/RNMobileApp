import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {AppFlowStack} from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import { AuthStack } from './AuthStack';


// Define the param list for the stack navigator
export type AppStackParamList = {
  AuthStack: undefined;
  BottomTabBar: undefined;
  AppFlowStack: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
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

    </Stack.Navigator>
  );
};

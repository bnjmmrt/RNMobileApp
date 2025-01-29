import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import UserDetails from 'src/screens/UsersModule/UserDetails';
import {SCREENS} from 'src/utils/constants';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import {AppFlowStack} from './AppFlowStack';

// Define the param list for the stack navigator
export type OnboardingStackkParamList = {
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  [SCREENS.USER_DETAIL]: {user: number};
};

const Stack = createStackNavigator<OnboardingStackkParamList>();

export const OnboardingStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTabBar"
      screenOptions={({route, navigation}) => ({})}>
      <Stack.Screen
        name="AppFlowStack"
        component={AppFlowStack}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="BottomTabBar"
        component={BottomTabBar}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={SCREENS.USER_DETAIL}
        component={UserDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

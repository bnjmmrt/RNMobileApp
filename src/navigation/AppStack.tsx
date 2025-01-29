import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppFlowStack} from './AppFlowStack';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import BeforeAppStaticScreen from '../screens/BeforeApplicationFlow/BeforeAppStaticScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/slices';
import {AuthStack} from './AuthStack';
import {SCREENS} from 'src/utils/constants';

// Define the param list for the stack navigator
export type AppStackParamList = {
  BeforeAppStaticScreen: undefined;
  BottomTabBar: undefined;
  AppFlowStack: undefined;
  AuthStack: undefined;
  [SCREENS.USER_DETAIL]: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={'BottomTabBar'}
      screenOptions={({route, navigation}) => ({})}>
      <Stack.Screen
        name="BeforeAppStaticScreen"
        component={BeforeAppStaticScreen}
        options={{headerShown: false}}
      />

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
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={SCREENS.USER_DETAIL}
        component={AuthStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

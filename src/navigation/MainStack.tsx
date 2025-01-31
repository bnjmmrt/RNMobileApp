import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export type MainStackParamList = {
  AuthStack: undefined;
  AppStack: { screen?: string };
};

const Stack = createStackNavigator<MainStackParamList>();

interface MainStackProps {
  initialRouteName: keyof MainStackParamList;
  initialParams?: { screen?: string };
}

export const MainStack: React.FC<MainStackProps> = ({ initialRouteName, initialParams }) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen
        name="AppStack"
        component={AppStack}
        initialParams={initialParams}
      />
    </Stack.Navigator>
  );
};

import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import WelcomeScreen from '../screens/AppFlow/WelcomeScreen/WelcomeScreen';
import CommunityGuideLinesScreen from 'src/screens/AppFlow/CommunityGuideLinesScreen/CommunityGuideLinesScreen'

export type MainStackParamList = {
  WelcomeScreen: undefined;
  CommunityGuidelinesScreen: undefined;
  AuthStack: undefined;
  AppStack: { screen?: string };
};

const Stack = createStackNavigator<MainStackParamList>();

interface MainStackProps {
  initialRouteName: keyof MainStackParamList;
  initialParams?: { screen?: string };
}

export const MainStack: React.FC<MainStackProps> = ({
  initialRouteName,
  initialParams,
}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="CommunityGuidelinesScreen" component={CommunityGuideLinesScreen} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen
        name="AppStack"
        component={AppStack}
        initialParams={initialParams}
      />
    </Stack.Navigator>
  );
};

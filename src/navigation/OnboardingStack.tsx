import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/DiscoverScreen/DiscoverScreen';
import HomeTabs from '../component/Tabbar/BottomTabBar';


// Define the param list for the stack navigator
export type OnboardingStackkParamList = {
  Home: undefined;
};

const Stack = createStackNavigator<OnboardingStackkParamList>();

export const OnboardingStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({})}>

     <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{ headerShown: false }}
      /> 
    
    </Stack.Navigator>
  );
};

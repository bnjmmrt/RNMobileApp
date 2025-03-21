import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import EventScreen from 'src/screens/EventScreen/EventScreen';

// Define the param list for the stack navigator
export type EventsStackParamList = {
  EventScreen: undefined;
  EventDetailsScreen: undefined;
};

const Stack = createStackNavigator<EventsStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

const getTabBarStyle = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.name;

  // Hide the Bottom Tab Bar for specific screens
  if (routeName === 'EventDetailsScreen') {
    return { display: 'none' };
  }

  // Default style for other screens
  return {};
};

export const EventsStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={'EventScreen'}
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: getTabBarStyle(route), // Dynamically control tabBarStyle
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}>
      <Stack.Screen
        name="EventScreen"
        component={EventScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

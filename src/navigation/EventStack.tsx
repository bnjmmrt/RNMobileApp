import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventScreen from 'src/screens/EventScreen/EventScreen';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import RSPVScreen from 'src/screens/EventScreen/RSPV/RSPVScreen';


// Define the param list for the stack navigator
export type EventStackParamList = {
  EventScreen: undefined;
  EventDetailsScreen: undefined;
};

const Stack = createStackNavigator<EventStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const EventStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={"EventScreen"}
      screenOptions={({ route, navigation }) => ({})}>

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
      <Stack.Screen
        name="RSPVScreen"
        component={RSPVScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import EventScreen from 'src/screens/EventScreen/EventScreen';
import ManageGuests from 'src/screens/EventScreen/InviteGuestInEventFlow/ManageGuests';
import AddGuestOptionScreen from 'src/screens/EventScreen/RSVP/AddGuestOptionScreen';
import AddGuestScreen from 'src/screens/EventScreen/RSVP/AddGuestScreen';
import RSVPInvitedUpcoming from 'src/screens/EventScreen/RSVP/RSVPInvitedUpcoming';
import RSVPNoStatusApplied from 'src/screens/EventScreen/RSVP/RSVPNoStatusApplied';
import {ROUTES} from './Route';
import InviteGuests from 'src/screens/EventScreen/InviteGuestInEventFlow/InviteGuests';

// Define the param list for the stack navigator
export type EventStackParamList = {
  EventScreen: undefined;
  EventDetailsScreen: undefined;
  [ROUTES.InviteGuestsScreen]: undefined;
  [ROUTES.ManageGuestsScreen]: undefined;
};

const Stack = createStackNavigator<EventStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const EventStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={'EventScreen'}
      screenOptions={({route, navigation}) => ({headerShown: false})}>
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />

      <Stack.Screen
        name="RSVPNoStatusApplied"
        component={RSVPNoStatusApplied}
      />
      <Stack.Screen
        name="RSVPInvitedUpcoming"
        component={RSVPInvitedUpcoming}
      />
      <Stack.Screen
        name="AddGuestOptionScreen"
        component={AddGuestOptionScreen}
      />
      <Stack.Screen name="AddGuestScreen" component={AddGuestScreen} />

      {/* Invite Guest Screens */}
      <Stack.Screen name={ROUTES.InviteGuestsScreen} component={InviteGuests} />
      <Stack.Screen name={ROUTES.ManageGuestsScreen} component={ManageGuests} />
    </Stack.Navigator>
  );
};

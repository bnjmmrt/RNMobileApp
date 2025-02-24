import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import EventScreen from 'src/screens/EventScreen/EventScreen';
import ManageGuests from 'src/screens/EventScreen/InviteGuestInEventFlow/ManageGuests';
import AddGuestOptionScreen from 'src/screens/EventScreen/RSVP/AddGuestOptionScreen';
import AddGuestScreen from 'src/screens/EventScreen/RSVP/AddGuestScreen';
import RSVPInvitedUpcoming from 'src/screens/EventScreen/RSVP/RSVPInvitedUpcoming';
import RSVPNoStatusApplied from 'src/screens/EventScreen/RSVP/RSVPNoStatusApplied';
import InviteGuests from 'src/screens/EventScreen/InviteGuestInEventFlow/InviteGuests';
import EventGuestList from 'src/screens/EventScreen/ManageGuestFlow/EventGuestListScreen';
import GuestCheckInScreen from 'src/screens/EventScreen/Guest/GuestCheckInScreen';
import QRCodeScanner from 'src/screens/EventScreen/Guest/QRScannar';
import GuestDetailScreen from 'src/screens/EventScreen/ManageGuestFlow/GuestDetailScreen';
import { ROUTES } from './Route';
import InviteGuestsManually from 'src/screens/EventScreen/InviteGuestInEventFlow/InviteGuestsManually';

// Define the param list for the stack navigator
export type EventStackParamList = {
  EventScreen: undefined;
  EventDetailsScreen: undefined;
  RSVPNoStatusApplied: { event: any };
  RSVPInvitedUpcoming: { event: any };
  AddGuestOptionScreen: undefined;
  AddGuestScreen: undefined;
  EventGuestList: { guests: Array<{ name: string; status: string }> };
  GuestCheckInScreen: undefined;
  QRCodeScanner: undefined;
  GuestDetailScreen: { guest: any };
  [ROUTES.InviteGuestsScreen]: undefined;
  [ROUTES.ManageGuestsScreen]: {
    isManual: boolean;
    type: 'contact' | 'email' | 'existing';
  };
  [ROUTES.InviteGuestsManuallyScreen]: undefined;
};

const Stack = createStackNavigator<EventStackParamList>();
// const loginData = useSelector((state: RootState) => state.auth.loginData);

export const EventStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={'EventScreen'}
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
        name={ROUTES.EventGuestList}
        component={EventGuestList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.GuestDetailScreen}
        component={GuestDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RSVPNoStatusApplied"
        component={RSVPNoStatusApplied}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RSVPInvitedUpcoming"
        component={RSVPInvitedUpcoming}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddGuestOptionScreen"
        component={AddGuestOptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GuestCheckInScreen"
        component={GuestCheckInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddGuestScreen"
        component={AddGuestScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="QRCodeScanner"
      component={QRCodeScanner} 
      options={{ headerShown: false }}/>
      <Stack.Screen
        name={ROUTES.InviteGuestsScreen}
        component={InviteGuests}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.InviteGuestsManuallyScreen}
        component={InviteGuestsManually}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ManageGuestsScreen}
        component={ManageGuests}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

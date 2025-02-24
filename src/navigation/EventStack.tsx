import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EventDetailsScreen from 'src/screens/EventScreen/EventDetailsScreen';
import EventScreen from 'src/screens/EventScreen/EventScreen';
import InviteGuest from 'src/screens/EventScreen/InviteGuestInEventFlow/InviteGuest';
import AddGuestOptionScreen from 'src/screens/EventScreen/RSVP/AddGuestOptionScreen';
import AddGuestScreen from 'src/screens/EventScreen/RSVP/AddGuestScreen';
import RSVPInvitedUpcoming from 'src/screens/EventScreen/RSVP/RSVPInvitedUpcoming';
import RSVPNoStatusApplied from 'src/screens/EventScreen/RSVP/RSVPNoStatusApplied';
import SelectGuestsToInvite from 'src/screens/EventScreen/InviteGuestInEventFlow/SelectGuestsToInvite';
import EventGuestList from 'src/screens/EventScreen/ManageGuestFlow/EventGuestListScreen';
import GuestCheckInScreen from 'src/screens/EventScreen/Guest/GuestCheckInScreen';
import QRCodeScanner from 'src/screens/EventScreen/Guest/QRScannar';
import GuestDetailScreen from 'src/screens/EventScreen/ManageGuestFlow/GuestDetailScreen';
import { ROUTES } from './Route';
import InviteGuestsManually from 'src/screens/EventScreen/InviteGuestInEventFlow/InviteGuestsManually';
import SelectedGuestsToInviteScreen from 'src/screens/EventScreen/InviteGuestInEventFlow/SelectedGuestsToInvite';

// Define the param list for the stack navigator
export type EventStackParamList = {
  EventScreen: undefined;
  [ROUTES.EventDetailsScreen]: {};
  RSVPNoStatusApplied: { event: any };
  RSVPInvitedUpcoming: { event: any };
  AddGuestOptionScreen: undefined;
  AddGuestScreen: undefined;
  EventGuestList: { guests: Array<{ name: string; status: string }> };
  GuestCheckInScreen: undefined;
  QRCodeScanner: undefined;
  GuestDetailScreen: { guest: any };
  [ROUTES.SelectGuestsToInviteScreen]: undefined;
  [ROUTES.SelectedGuestsToInviteScreen]: undefined;
  [ROUTES.InviteGuestScreen]: {
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
        name={ROUTES.EventDetailsScreen}
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
        name={ROUTES.SelectGuestsToInviteScreen}
        component={SelectGuestsToInvite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.InviteGuestsManuallyScreen}
        component={InviteGuestsManually}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.InviteGuestScreen}
        component={InviteGuest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.SelectedGuestsToInviteScreen}
        component={SelectedGuestsToInviteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

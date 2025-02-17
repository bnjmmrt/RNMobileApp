import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

type PermissionStatus = boolean | null;
export interface Event {
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  notes: string;
}

const useCalender = (eventDetails: Event) => {
  const {title, startDate, endDate, location, notes} = eventDetails;
  const [permissionGranted, setPermissionGranted] =
    useState<PermissionStatus>(null);

  const checkPermission = async () => {
    const status = await RNCalendarEvents.checkPermissions();
    if (status === 'authorized') {
      setPermissionGranted(true);
    } else {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    const status = await RNCalendarEvents.requestPermissions();
    if (status === 'authorized') {
      setPermissionGranted(true);
    } else {
      Alert.alert(
        'Permission Denied',
        'Calendar access is required to add events.',
      );
    }
  };

  const addEventToCalendar = async () => {
    await checkPermission();
    if (!permissionGranted) {
      Alert.alert(
        'Permission Required',
        '“Rumor” Would Like to Access Your Calendar',
      );
      return;
    }

    try {
      //  await RNCalendarEvents.findCalendars()
      const eventId = await RNCalendarEvents.saveEvent(title, {
        startDate: startDate,
        endDate: endDate,
        location: location,
        notes: notes,
        alarms: [{date: -15}], // 15 minutes before
      });

      if (eventId) {
        Alert.alert('Event Added', 'Check your calendar for the event.');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return {permissionGranted, addEventToCalendar, checkPermission};
};

export default useCalender;

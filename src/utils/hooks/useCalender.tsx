import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { LABLE } from '../constants';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

type PermissionStatus = boolean | null;
export interface Event {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  notes: string;
}

const useCalender = (eventDetails: Event) => {
  const { title, startDate, endDate, location, notes } = eventDetails;
  const [permissionGranted, setPermissionGranted] = useState<PermissionStatus>(null);

  const checkPermission = async () => {
    try {
      let status = await RNCalendarEvents.checkPermissions();

      if (status !== 'authorized') {
        status = await RNCalendarEvents.requestPermissions();
      }

      if (status === 'authorized') {
        setPermissionGranted(true);
      } else {
        setPermissionGranted(false);
        Alert.alert(LABLE.PERMISSION_DENIED, LABLE.ACCESS_CALENDAR);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setPermissionGranted(false);
    }
  };

  const addEventToCalendar = async () => {
    const status = await RNCalendarEvents.checkPermissions();

    if (status !== 'authorized') {
      const newStatus = await RNCalendarEvents.requestPermissions();
      if (newStatus !== 'authorized') {
        Alert.alert(LABLE.PERMISSION_DENIED, LABLE.ACCESS_CALENDAR);
        return;
      }
    }

    try {
      const calendars = await RNCalendarEvents.findCalendars();
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        FlashMessageComponent.show(
          `error`,
          LABLE.NO_CALENDAR_FOUND,
        );
        return;
      }

      const eventId = await RNCalendarEvents.saveEvent(title, {
        startDate,
        endDate,
        location,
        notes,
        alarms: [{ date: -15 }], // 15 minutes before
        calendarId: defaultCalendar.id, // REQUIRED for Android
      });

      if (eventId) {
        FlashMessageComponent.show(
          `success`,
          `Event Addes: Switched to Check your calendar for the event.`,
        );
        // Alert.alert('Event Added', 'Check your calendar for the event.');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      FlashMessageComponent.show(
        `error`,
        `Failed to add event.`,
      );
    }
  };


  return { permissionGranted, addEventToCalendar, checkPermission };
};

export default useCalender;

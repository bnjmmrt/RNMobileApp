import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Notifications = {
  allowEmailNotifications: boolean;
  allowPushNotifications: boolean;
  allowSMSNotifications: boolean;
  enableAppNotifications?: boolean;
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  muteDuration?: string;
  muteNotifications?: boolean;
  notifyForEventAnnouncements?: boolean;
  notifyForEventInvitations?: boolean;
  notifyForEventsInMyCity?: boolean;
  notifyForMessagesFromHost?: boolean;
  notifyWhenFollowingEventHost?: boolean;
  timeLeftMuteNotification?: string;
};
export interface Settings {
  notificationsSettings: Notifications;
}

const initialState: Settings = {
  notificationsSettings: {
    allowEmailNotifications: true,
    allowPushNotifications: true,
    allowSMSNotifications: true,
    enableAppNotifications: true,
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    muteDuration: '',
    muteNotifications: true,
    notifyForEventAnnouncements: true,
    notifyForEventInvitations: true,
    notifyForEventsInMyCity: true,
    notifyForMessagesFromHost: true,
    notifyWhenFollowingEventHost: true,
    timeLeftMuteNotification: '',
  },
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setNotificationSettings(state, action: PayloadAction<Notifications>) {
      state.notificationsSettings = action.payload;
    },
    getAppSettings(state) {
      // return state object
      return state;
    },
    resetAppSettings(state) {
      // Reset state to initial values
      Object.assign(state, initialState);
    },
  },
});

export const {setNotificationSettings, getAppSettings, resetAppSettings} =
  appSettingsSlice.actions;

export default appSettingsSlice.reducer;

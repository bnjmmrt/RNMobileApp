import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { setFcmToken } from 'src/redux/slices/authSlice';
import { navigate, navigateToNestedStack } from './NavigationService';
import { ROUTES } from 'src/navigation/Route';
import store from 'src/redux/store';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Request Notification Permission
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        getFCMToken()
    }
}

// Get FCM Token
export async function getFCMToken() {
    const dispatch = store.store.dispatch;
    try {
        const token = await messaging().getToken();
        console.log(" siya FCM Token:", token);
        dispatch(setFcmToken(token))
        return token;
    } catch (error) {
        console.log(" siya Error getting FCM token:", error);
    }
}

export const NotificationsListener = async () => {
    // Background/killed state handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("Message handled in the background!", remoteMessage);
    });

    // Foreground listener
    messaging().onMessage(async remoteMessage => {
        console.log('Received foreground message:', remoteMessage);
        await onDisplayNotification(remoteMessage);
    });

    // Handle when app is in background and user taps notification
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background:', remoteMessage);
        // if (remoteMessage?.data?.screen) {
        //     navigateToScreen(remoteMessage.data.screen);
        // }
    });

    // Handle when app was killed and user taps notification
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage);
            // if (remoteMessage?.data?.screen) {
            //     navigateToScreen(remoteMessage?.data);
            // }
        }
    });
};

async function onDisplayNotification(remoteMessage: any) {
    console.log('Received message: Foreground', remoteMessage);

    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: remoteMessage.data.title || 'Default Title',
        body: remoteMessage.data.body || 'Default Body',
        android: {
            channelId,
            smallIcon: 'ic_launcher', // Ensure you have a valid small icon in Android
            pressAction: { id: 'default' },
        },
    });
}

// async function onDisplayNotification(remoteMessage:any) {
//     console.log('Received message: Foreground',remoteMessage);
//     let noti = {
//         "to": "DEVICE_FCM_TOKEN",
//         "data": {
//           "title": "Notification Title",
//           "body": "Main body content of the notification"
//         }
//       }
//     // Request permissions (required for iOS)
//     await notifee.requestPermission()

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: 'Notification Title',
//       body: 'Main body content of the notification',
//       android: {
//         channelId,
//         smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//         // pressAction is needed if you want the notification to open the app when pressed
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   }


export const navigateToScreen = (data: any) => {
    // Use navigationRef to navigate if navigation is not yet mounted
    setTimeout(() => {
        // if (data?.type === 'eventReminder' || 'eventInvitation' || 'eventPosted' || 'eventPostedCity' || 'eventRequestApproved' || 'eventRequestDenied' || 'signUpFormApproved' || 'eventSubmissionApproved' || 'eventAnnouncement') {
        //     let eventData = {
        //         id: data?.eventId
        //     }
        //     navigateToNestedStack(ROUTES.EventStack, ROUTES.EventDetailsScreen, eventData);
        // }
        if (data?.type === 'eventVouch') {
            let eventData = {
                id: data?.eventId
            }
            navigateToNestedStack(ROUTES.EventStack, 'Profile - Referrals page ', eventData);
        }
        else {
            let eventData = {
                id: data?.eventId
            }
            navigateToNestedStack(ROUTES.EventStack, ROUTES.EventDetailsScreen, eventData);
        }
    }, 1000);
};

import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFcmToken } from 'src/redux/slices/authSlice';
import { navigate, navigateToNestedStack } from './NavigationService';
import { ROUTES } from 'src/navigation/Route';
import store from 'src/redux/store';
import notifee, { AndroidImportance } from '@notifee/react-native';
import useApi from 'src/axios/useApi';
import { RootState } from 'src/redux/slices';
import { EndPoint } from 'src/ApiManager/config';

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
        if (remoteMessage?.data) {
            // markeAsRead(remoteMessage);
            navigateToScreen(remoteMessage, 'push')
        }
    });

    // Handle when app was killed and user taps notification
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage);
            if (remoteMessage?.data) {
                // markeAsRead(remoteMessage);
                navigateToScreen(remoteMessage, 'push')
            }
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
        title: remoteMessage.notification.title || 'Default Title',
        body: remoteMessage.notification.body || 'Default Body',
        android: {
            channelId,
            smallIcon: 'ic_launcher', // Ensure you have a valid small icon in Android
            pressAction: { id: 'default' },
        },
    });
}

const markeAsRead = async (data: any) => {
    console.log("markeAsRead response: tetstts");

    const { apiRequest } = useApi();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const response: any = await apiRequest(
        'get',
        `${EndPoint.noti_detail}/${data.messageId}`);
    console.log("markeAsRead response:", response);
    if (response.success) {
        navigateToScreen(data, 'push')
    }
}

export const navigateToScreen = (data: any, type: string = 'in-app') => {
    console.log("navigateToScreen data:", data);
    const eventTypes = [
        'eventReminder',
        // 'eventCancelled',
        'eventInvitation',
        'eventPosted',
        'eventPostedCity',
        'eventRequestApproved',
        'eventRequestDenied',
        'eventVouch',
        'signUpFormApproved',
        'signUpFormRejected',
        'eventInvitationNonMember',
        'eventSubmissionApproved',
        'eventAnnouncement',
        'newGuestRequest',
        'eventApproved',
        'eventSubmitted',
        'eventEdited',
    ];
    let notifiType = type === 'push' ? data?.data?.notificationType : data?.type;
    if (eventTypes.includes(notifiType)) {
        let eventData = {
            id: type == 'push' ? data?.data?.eventId : data?.body?.eventId
        };
        navigateToNestedStack(ROUTES.EventStack, ROUTES.EventDetailsScreen, eventData);
    } else if (notifiType === 'hostApplication') {
        let userData = {
            hostId: type == 'push' ? data?.data?.userId : data?.body?.userId
        };
        navigateToNestedStack('ProfileStack', ROUTES.HostProfileScreen, userData);
    } else if (notifiType === 'userApplication' || notifiType === 'profileReferrals') {
        let userData = {
            user: type == 'push' ? data?.data?.userId : data?.body?.userId
        };
        navigate(ROUTES.UserDetail, userData);
    } else { }
};


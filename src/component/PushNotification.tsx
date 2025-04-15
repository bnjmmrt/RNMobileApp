import messaging from '@react-native-firebase/messaging';
import { setFcmToken, setIsGuest, setNotificationAlert } from 'src/redux/slices/authSlice';
import { navigate, navigateToNestedStack } from './NavigationService';
import { ROUTES } from 'src/navigation/Route';
import store from 'src/redux/store';
import notifee from '@notifee/react-native';
// Request Notification Permission
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('Authorization status:', authStatus, enabled);
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
    const dispatch = store.store.dispatch;
    // Background/killed state handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("Message handled in the background!", remoteMessage);
        if (remoteMessage?.data?.notificationType == 'eventInvitationNonMember') {
            dispatch(setIsGuest(true))
        }
    });

    // Foreground listener
    messaging().onMessage(async remoteMessage => {
        const dispatch = store.store.dispatch;
        console.log('Received foreground message:', remoteMessage);
        if (remoteMessage?.data?.notificationType == 'eventInvitationNonMember') {
            dispatch(setIsGuest(true))
        }
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

export const navigateToScreen = (data: any, type: string = 'in-app') => {
    console.log('navigateToScreen:', data);

    const role = store.store.getState().auth.role;
    const dispatch = store.store.dispatch;
    const myRole = "non-member"
    if (data?.data?.role != role && type == 'push') {
        dispatch(setNotificationAlert(true))
        return
    }
    const eventTypes = [
        'eventReminder',
        // 'eventCancelled',
        'eventInvitation',
        'eventPosted',
        'eventPostedCity',
        'eventRequestApproved',
        'eventRequestDenied',
        // 'eventVouch',
        'signUpFormApproved',
        'signUpFormRejected',
        // 'rsvpSignupFormRequest',
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
    } else if (notifiType === 'rsvpSignupFormRequest') {
        let eventData = {
            eventId: type == 'push' ? data?.data?.eventId : data?.body?.eventId,
        };
        console.log(" RSVP Signup Form Request", eventData);
        navigateToNestedStack(ROUTES.EventStack, ROUTES.EventGuestList, eventData);
    }
    else if (notifiType === 'eventVouch') {
        console.log("Event Vouch");
        let userData = { activeTab: 'vouches' };
        navigateToNestedStack(ROUTES.ProfileStack, ROUTES.ReferralScreen, userData);
    }
    else if (notifiType === 'profileReferrals') {
        let userData = { activeTab: 'referrals' };
        navigateToNestedStack(ROUTES.ProfileStack, ROUTES.ReferralScreen, userData);
    }
    else if (notifiType === 'hostApplication') {
        let userData = {
            hostId: type == 'push' ? data?.data?.userId : data?.body?.userId
        };
        navigateToNestedStack('ProfileStack', ROUTES.HostProfileScreen, userData);
    }
    else if (notifiType === 'userApplication') {
        let userData = {
            user: type == 'push' ? data?.data?.userId : data?.body?.userId
        };
        navigate(ROUTES.UserDetail, userData);
    }
    else { }
};


/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect,useCallback } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainNavigation from 'src/navigation';
import { EndPoint } from './src/ApiManager/config';
import useApi from './src/axios/useApi';
import NoInternetScreen from './src/component/NoInternetScreen';
import { SafeAreaViewWrapper } from './src/component/Wrappers/SafeAreaViewWrapper';
import {
  setCreativeFocus,
  setInterests,
} from './src/redux/slices/appGlobalDataSlice';
import { persistor, store } from './src/redux/store';
// import MainNavigation from 'src/navigation';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import messaging, { firebase } from '@react-native-firebase/messaging';
import FirebaseApp, { initializeApp } from '@react-native-firebase/app';
import { getFCMToken, NotificationsListener, requestUserPermission } from 'src/component/PushNotification';
const AppContent: React.FC = () => {
  const { isConnected } = useNetInfo();
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  // Your Firebase configuration


  useEffect(() => {
    if (!firebase.apps.length) {

    firebase.initializeApp({
      appId: '1:911470503708:ios:1dabd0fac35dbd0f5abcd9',
      projectId: 'therumor-development',
      apiKey: 'AIzaSyAGFfFYB9OFSO1TVvWyJpp2QHRcbhANpqw',
      databaseURL: '',
      messagingSenderId: '911470503708',
      androidClientId: '',
      clientId: '',
      deepLinkURLScheme: '',
      gaTrackingId: '',
      storageBucket: '',
    })
    .then((result)=>{
      console.log("firebase intilatize successfully ####### ",result)
    })
    .catch((err) => console.log('Error initializing firebase', err));
  }else {
    console.log("print firbase details $$$$$$$  ",firebase.app())
    firebase.app(); // if already initialized, use that one
 }

 setupFirebase()
   
  }, []);


  const setupFirebase = async() => {
   setTimeout(async() => {
    await getFcmToken()
   }, 2000);
  }



  const getFcmToken = useCallback(async () => {
    try {
      const hasPermission = await messaging().hasPermission();
      console.log('FCM hasPermission:', hasPermission.toString());
      if (hasPermission < 1) {
       
          // Some logic is probably missing here
          await messaging().requestPermission();
      }

      const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
      if (!isRegistered) await messaging().registerDeviceForRemoteMessages();
      console.log("print isRegister $$$$$$$   ",isRegistered)
      const token = await messaging().getToken({
        senderId:'911470503708'
      });
      console.log('Registered for push notifications (notifications-ms):==============',token);

      // return token;
    } catch (err) {
      // const token = await messaging().getToken({
      //   senderId:'911470503708'
      // });
      // console.log('Registered for push notifications (notifications-ms):--------------',token);

      console.log("firbase getToken error ####### ",err);
    }
  }, []);



  // const getFCMToken = async () => {
  //   try {
  //     const token = await messaging().getToken({
  //       senderId: '911470503708'
  //     });
  //     console.log(" siya FCM Token:", token);
  //     return token;
  //   } catch (error) {
  //     console.log(" siya Error getting FCM token:", error);
  //   }
  // }

  useEffect(() => {
    // Enable screenshot prevention
    RNPreventScreenshot?.enableSecureView();

    // Cleanup on unmount
    return () => {
      RNPreventScreenshot?.disableSecureView();
    };
  }, [RNPreventScreenshot]);

  const fetch = async () => {
    const focusResponse: any = await apiRequest('get', EndPoint.get_focuses);
    if (focusResponse.data) {
      focusResponse.data.sort((a, b) => a.name.localeCompare(b.name));
      dispatch(setCreativeFocus(focusResponse.data));
    }
    const interestResponse: any = await apiRequest('get', EndPoint.interests);
    if (interestResponse.data) {
      interestResponse.data.sort((a, b) => a.name.localeCompare(b.name));
      dispatch(setInterests(interestResponse.data));
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  LogBox.ignoreAllLogs();

  if (!isConnected && isConnected !== null) {
    return <NoInternetScreen />;
  }
  return <MainNavigation />;
};

const App: React.FC = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
      text: 'black',
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaViewWrapper>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={MyTheme}>
              <BottomSheetModalProvider>
                <AppContent />
              </BottomSheetModalProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaViewWrapper>
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

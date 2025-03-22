/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useCallback } from 'react';
import { LogBox, Platform, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainNavigation from 'src/navigation';
import { EndPoint } from './src/ApiManager/config';
import useApi from './src/axios/useApi';
import NoInternetScreen from './src/component/NoInternetScreen';
import { SafeAreaViewWrapper } from './src/component/Wrappers/SafeAreaViewWrapper';
import {
  setCreativeFocus,
  setInterests,
  setNotificationCount,
} from './src/redux/slices/appGlobalDataSlice';
import { persistor, store } from './src/redux/store';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import { NotificationsListener, requestUserPermission } from 'src/component/PushNotification';
import { navigationRef } from 'src/component/NavigationService';
import ScreenshotDetectedDialog from 'src/component/ScreenshotDetectedDialog';
import { getDeviceId } from 'src/utils/functions';
import Intercom, { Visibility } from '@intercom/intercom-react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import analytics from '@react-native-firebase/analytics';
import { useFetchNotificationCountQuery } from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';

const AppContent: React.FC = () => {
  const { isConnected } = useNetInfo();
  const { apiRequest } = useApi();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const updateAnalyticsStatus = async (status: boolean) => {
    await analytics().setAnalyticsCollectionEnabled(status);
  };

  useEffect(() => {
    NotificationSetup()
    Intercom.setLauncherVisibility(Visibility.GONE);
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(status => {
        switch (status) {
          case RESULTS.UNAVAILABLE:
            updateAnalyticsStatus(true);
          case RESULTS.DENIED:
            updateAnalyticsStatus(false);
          case RESULTS.BLOCKED:
            updateAnalyticsStatus(false);
          case RESULTS.GRANTED:
            updateAnalyticsStatus(true);
          case RESULTS.LIMITED:
            updateAnalyticsStatus(true);
        }
      });
    }
  }, []);



  const NotificationSetup = async () => {
    getDeviceId()
    requestUserPermission()
    NotificationsListener()
  }


  // useEffect(() => {
  //   RNPreventScreenshot?.enableSecureView();
  //   return () => {
  //     RNPreventScreenshot?.disableSecureView();
  //   };
  // }, [RNPreventScreenshot]);

  const fetch = async () => {
    const focusResponse: any = await apiRequest('get', EndPoint.get_focuses);
    console.log('focusResponse.data', focusResponse.data);
    if (focusResponse.data) {
      focusResponse.data.sort((a, b) => a.name.localeCompare(b.name));
      dispatch(setCreativeFocus(focusResponse.data));
    }
    const interestResponse: any = await apiRequest('get', EndPoint.interests);
    if (interestResponse.data) {
      interestResponse.data.sort((a, b) => a.name.localeCompare(b.name));
      dispatch(setInterests(interestResponse.data));
    }
    if (token) {
      const notificationCount: any = await apiRequest('get', EndPoint.notification_count);
      console.log('notificationCount.data', notificationCount);
      if (notificationCount.data) {
        dispatch(setNotificationCount(notificationCount?.data?.totalNotifications));
      }
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
  return null;
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
          <ScreenshotDetectedDialog />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={MyTheme} ref={navigationRef}>
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

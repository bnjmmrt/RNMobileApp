/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { LogBox, Platform } from 'react-native';
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
} from './src/redux/slices/appGlobalDataSlice';
import { persistor, store } from './src/redux/store';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import {
  NotificationsListener,
  requestUserPermission,
} from 'src/component/PushNotification';
import { navigationRef } from 'src/component/NavigationService';
import ScreenshotDetectedDialog from 'src/component/ScreenshotDetectedDialog';
import { fetchUserProfile, getDeviceId } from 'src/utils/functions';
import Intercom, { Visibility } from '@intercom/intercom-react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import analytics from '@react-native-firebase/analytics';
import { environment } from 'environments/environment';
import { environment as environmentProd } from 'environments/environment.prod';
import NotificationDialog from 'src/component/NotificationDialog';
import { useGetUserWithRolesByIdMutation } from 'src/redux/actions/inviteGuestsApiAction';
import { RootState } from 'src/redux/slices';
import {
  setAuthToken,
  setRole,
  setRoleId,
  setRoles,
} from 'src/redux/slices/authSlice';
import { useLogout } from 'src/utils/hooks/useLogout';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { useBranchDeepLink } from 'src/hooks/useBranchDeepLink';
import { ROUTES } from 'src/navigation/Route';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from 'src/navigation/AppStack';

interface FocusItem {
  name: string;
  [key: string]: any;
}

interface Role {
  roleName: string;
  roleId: string;
}

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const AppContent: React.FC = () => {
  const { isConnected } = useNetInfo();
  const { apiRequest } = useApi();
  const dispatch = useDispatch();
  const [getUserById] = useGetUserWithRolesByIdMutation();
  const resetApp = useSelector((state: RootState) => state.auth.resetApp);
  const targetRole = useSelector(
    (state: RootState) => state.auth.targetRole,
  ) as Role;
  const { logOut } = useLogout();
  const hasLoggedOut = useRef(false);
  const { navigate } = useNavigation<NavigationProp>();
  const updateAnalyticsStatus = async (status: boolean) => {
    await analytics().setAnalyticsCollectionEnabled(status);
  };

  const userId = useSelector((state: RootState) => state.auth.userId);

  useBranchDeepLink();

  const fetchUserById = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await getUserById({ id: userId }).unwrap();
      if (response.success) {
        const { roles } = response.data;
        const transformedRoles = roles.map((role: any) => ({
          roleName: role.name,
          roleId: role.id,
          roleStatus: role.status,
        }));
        dispatch(setRoles(transformedRoles));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {

    if (userId) {
      fetchUserById();
    }
  }, []);

  useEffect(() => {
    if (resetApp && !hasLoggedOut.current) {
      hasLoggedOut.current = true;
      logOut();
      hasLoggedOut.current = false;
    }
  }, [resetApp]);

  useEffect(() => {
    const switchProfile = async () => {
      try {
        const response: any = await apiRequest(
          'post',
          `${EndPoint.switch_profile}/${userId}`,
          { targetRole: targetRole.roleName },
        );

        if (response?.success) {
          FlashMessageComponent.show(
            'success',
            'Your current active role is deactivated, and have been switched account',
          );
          // `Your current active role is deactivated and Switched to ${getRoleRole(targetRole?.roleName)} Account`
          dispatch(setRole(targetRole.roleName));
          dispatch(setRoleId(targetRole.roleId));
          dispatch(setAuthToken(response?.data?.token));
          fetchUserProfile();
          navigate(ROUTES.BottomTabBar);
        }
      } catch (error) {
        console.error('Failed to switch profile:', error);
      }
    };
    targetRole && switchProfile();
  }, [targetRole]);

  useEffect(() => {
    if (environment.BASE_URL == environmentProd.BASE_URL) {
      console.log('Running in production mode');
      RNPreventScreenshot?.enableSecureView();
      return () => {
        RNPreventScreenshot?.disableSecureView();
      };
    } else {
      console.log('Running in development mode');
    }
  }, []);

  useEffect(() => {
    NotificationSetup();
    Intercom.setBottomPadding(60);
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
    getDeviceId();
    requestUserPermission();
    NotificationsListener();
  };

  const fetch = async () => {
    const focusResponse: any = await apiRequest('get', EndPoint.get_focuses);
    if (focusResponse.data) {
      focusResponse.data.sort((a: FocusItem, b: FocusItem) =>
        a.name.localeCompare(b.name),
      );
      dispatch(setCreativeFocus(focusResponse.data));
    }
    const interestResponse: any = await apiRequest('get', EndPoint.interests);
    if (interestResponse.data) {
      interestResponse.data.sort((a: FocusItem, b: FocusItem) =>
        a.name.localeCompare(b.name),
      );
      dispatch(setInterests(interestResponse.data));
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetch();
    }
  }, [isConnected]);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  LogBox.ignoreAllLogs();

  if (isConnected === null) {
    return <></>;
  }
  if (!isConnected) {
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
          <ScreenshotDetectedDialog />
          <NotificationDialog />
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

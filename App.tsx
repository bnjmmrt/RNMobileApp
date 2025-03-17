/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
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
import ScreenshotDetectedDialog from 'src/component/ScreenshotDetectedDialog';
import Intercom, { Visibility } from '@intercom/intercom-react-native';


const AppContent: React.FC = () => {
  const { isConnected } = useNetInfo();
  const { apiRequest } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    RNPreventScreenshot?.enableSecureView();
    Intercom.setLauncherVisibility(Visibility.GONE);

    return () => {
      RNPreventScreenshot?.disableSecureView();
    };
  }, [RNPreventScreenshot]);


  const fetch = async () => {
    const focusResponse: any = await apiRequest('get', EndPoint.get_focuses);
    console.log("focusResponse.data",focusResponse.data)
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
          <ScreenshotDetectedDialog />
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

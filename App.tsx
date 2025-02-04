/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainNavigation from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DarkTheme from './src/Theme/DarkTheme';
// import DefaultTheme from './src/Theme/DefaultTheme';
import { AppContext } from './src/context/AppContext';
// import { NetInfoProvider, useAuth } from './src/context/NetInfoContext';
import NoInternetScreen from './src/component/NoInternetScreen';
import { useNetInfo } from '@react-native-community/netinfo';
import { store, persistor } from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaViewWrapper } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { EndPoint } from 'src/ApiManager/config';

import useApi from 'src/axios/useApi';
import { useDispatch } from 'react-redux';
import { setCreativeFocus } from 'src/redux/slices/appFlowSlice';
import { setInterests } from 'src/redux/slices/appFlowApiDataSlice';
const AppContent: React.FC = () => {
  // const { isInternetConnected } = useAuth();
  const { isConnected } = useNetInfo();
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const fetch = async () => {
    const focusResponse: any = await apiRequest('get', EndPoint.get_focuses);
    dispatch(setCreativeFocus(focusResponse.data));
    const interestResponse: any = await apiRequest('get', EndPoint.interests);
    dispatch(setInterests(interestResponse.data));
  };

  useEffect(() => {
    fetch();
  }, []);


  LogBox.ignoreAllLogs();
  useEffect(() => {
    console.log('Internet status:', isConnected);
  }, [isConnected]);

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
              {/* <AppContext.Provider value={appContext}> */}
              {/* <SafeAreaProvider style={styles.container}> */}
              <AppContent />
              <FlashMessage position="top" />
              {/* </SafeAreaProvider> */}
              {/* </AppContext.Provider> */}
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaViewWrapper>
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useState} from 'react';
import {Provider, useSelector} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, useColorScheme, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DarkTheme from './src/Theme/DarkTheme';
import DefaultTheme from './src/Theme/DefaultTheme';
import {AppContext} from './src/context/AppContext';
// import { NetInfoProvider, useAuth } from './src/context/NetInfoContext';
import NoInternetScreen from './src/component/NoInternetScreen';
import {useNetInfo} from '@react-native-community/netinfo';
import {store, persistor} from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaViewWrapper} from 'src/component/Wrappers/SafeAreaViewWrapper';

const AppContent: React.FC = () => {
  // const { isInternetConnected } = useAuth();
  const {isConnected} = useNetInfo();

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
  const systemTheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  type AppContextType = any;
  const appContext = useMemo<AppContextType>(
    () => ({
      isDarkTheme,
      setIsDarkTheme,
      themeColors: isDarkTheme ? DarkTheme.colors : DefaultTheme.colors,
    }),
    [isDarkTheme],
  );

  // useEffect(() => {
  //   setIsDarkTheme(systemTheme === 'light');
  // }, [systemTheme]);

  useEffect(() => {
    setIsDarkTheme(true);
  }, []);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log('Network status changed:', state.isConnected);
  //   });
  //   return () => unsubscribe(); // Cleanup the listener on component unmount
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaViewWrapper>
          <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer theme={isDarkTheme ? DarkTheme : DefaultTheme}>
              <AppContext.Provider value={appContext}>
                {/* <SafeAreaProvider style={styles.container}> */}
                <AppContent />
                <FlashMessage position="top" />
                {/* </SafeAreaProvider> */}
              </AppContext.Provider>
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

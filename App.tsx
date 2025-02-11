/* eslint-disable react-hooks/exhaustive-deps */
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNetInfo} from '@react-native-community/netinfo';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {LogBox, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useDispatch} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {EndPoint} from './src/ApiManager/config';
import useApi from './src/axios/useApi';
import EventsFeed from './src/component/EventsFeed/EventsFeed';
import NoInternetScreen from './src/component/NoInternetScreen';
import {SafeAreaViewWrapper} from './src/component/Wrappers/SafeAreaViewWrapper';
import {setCreativeFocus} from './src/redux/slices/appFlowSlice';
import {setInterests} from './src/redux/slices/appGlobalDataSlice';
import {persistor, store} from './src/redux/store';

const AppContent: React.FC = () => {
  // const { isInternetConnected } = useAuth();
  const {isConnected} = useNetInfo();
  const {apiRequest, loading, error} = useApi();
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
  // return <MainNavigation />;
  return <EventsFeed />;
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
          <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer theme={MyTheme}>
              <BottomSheetModalProvider>
                {/* <AppContext.Provider value={appContext}> */}
                {/* <SafeAreaProvider style={styles.container}> */}
                <AppContent />
                {/* </SafeAreaProvider> */}
                {/* </AppContext.Provider> */}
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

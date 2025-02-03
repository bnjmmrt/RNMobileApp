import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ChatScreenStyle from './ChatScreenStyle';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import {useFocusEffect} from '@react-navigation/native';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import {View} from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
// Define the type for navigation props
interface ChatScreenProps extends NativeStackScreenProps<any, any> {}

const ChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  const styles = ChatScreenStyle();

  const {isSignUpCompleted, token} = useSelector(
    (state: RootState) => state.auth.loginData,
  );
  const hasFullAccess = isSignUpCompleted || token.length > 0;

  // useFocusEffect(
  //   useCallback(() => {
  //     // Do something when the screen is focused
  //     changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.BLACK_SCHEME);

  //     return () => {
  //       // Optional cleanup when screen is unfocused
  //       changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
  //     };
  //   }, [])
  // );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );
  return (
    <View style={styles.container}>
      {hasFullAccess ? (
        <AfterAppStaticComponent />
      ) : (
        <BeforeAppStaticComponent isChatScreen={true} />
      )}
    </View>
  );
};

export default ChatScreen;

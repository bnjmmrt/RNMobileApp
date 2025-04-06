import React, { useCallback } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ChatScreenStyle from './ChatScreenStyle';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { shallowEqual, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { View } from 'react-native-animatable';
import { RootState } from 'src/redux/slices';
import { ROLE } from 'src/utils/constants';
interface ChatScreenProps extends NativeStackScreenProps<any, any> {}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const styles = ChatScreenStyle();

  const { role, token } = useSelector(
    (state: RootState) => ({
      token: state.auth.token,
      role: state.auth.role,
    }),
    shallowEqual,
  );

  useFocusEffect(
    useCallback(() => {
      if (!token && role !== ROLE.NON_MEMBER) {
        changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
          statusBarStyle: 'light-content',
        });
      }
    }, []),
  );

  if (token && role == ROLE.NON_MEMBER) {
    return <AfterAppStaticComponent />;
  }

  return (
    <View style={styles.container}>
      {token ? (
        role !== ROLE.NON_MEMBER ? (
          <BeforeAppStaticComponent isChatScreen={true} />
        ) : (
          <AfterAppStaticComponent />
        )
      ) : (
        <BeforeAppStaticComponent isChatScreen={true} />
      )}
    </View>
  );
};

export default ChatScreen;

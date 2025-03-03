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

  const hasFullAccess = token?.length > 0;

  useFocusEffect(
    useCallback(() => {
      if (!hasFullAccess && role !== 'non_member') {
        changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.STATIC_GRADIENT_SCHEME,
          showBottomSafeAreaView: false,
        });
      }
    }, []),
  );

  console.log(hasFullAccess, role !== 'non_member');

  return (
    <View style={styles.container}>
      {hasFullAccess ? (
        role !== 'non_member' ? (
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

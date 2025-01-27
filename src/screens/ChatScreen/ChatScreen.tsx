import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE } from '../../utils/constants';
import ChatScreenStyle from './ChatScreenStyle';
import { SafeAreaView } from 'react-native';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
// Define the type for navigation props
interface ChatScreenProps extends NativeStackScreenProps<any, any> { }

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const styles = ChatScreenStyle();

  const { isSignUpCompleted, token } = useSelector((state: RootState) => state.auth.loginData);
  const hasFullAccess = isSignUpCompleted || token.length > 0;

  // const loginData = useSelector((state: RootState) => state.auth.loginData);

  return (
    <SafeAreaView style={styles.container}>
      {hasFullAccess ?
        <AfterAppStaticComponent/>
        :
        <BeforeAppStaticComponent
          isChatScreen={true}/>
      }
    </SafeAreaView>
  );
};

export default ChatScreen;

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Linking, Image, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import Button from '../../component/Button';
import ChatScreenStyle from './ChatScreenStyle';
import ImageCarousel from '../../component/ImageCarosuel/ImageCarosuel';
import { SafeAreaView } from 'react-native';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
// Define the type for navigation props
interface ChatScreenProps extends NativeStackScreenProps<any, any> { }

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const styles = ChatScreenStyle();


  const onButtonClick = () => {
    navigation.navigate('EmailPhoneScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
    <BeforeAppStaticComponent
      title={LABLE.CHAT_WITH_HOST}
      subTitle={LABLE.CONNECT_DIRECTLY_WITH_PEOPLE} />
  </SafeAreaView>
  );
};

export default ChatScreen;

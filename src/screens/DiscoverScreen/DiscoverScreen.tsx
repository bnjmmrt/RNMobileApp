import React, { useRef, useState } from 'react';
import { View, StyleSheet, Linking, Image, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import Button from '../../component/Button';
import DiscoverScreenStyle from './DiscoverScreenStyle';
import ImageCarousel from '../../component/ImageCarosuel/ImageCarosuel';
import { SafeAreaView } from 'react-native';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> { }

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ navigation }) => {
  const styles = DiscoverScreenStyle();

  return (
    <SafeAreaView style={styles.container}>
      <BeforeAppStaticComponent
        title={LABLE.ACCESS_THE_MOST_VALUABLE_CALENDAR}
        subTitle={LABLE.DISCOVER_EXPERIENCES_IN_ART} />
    </SafeAreaView>
  );
};

export default DiscoverScreen;

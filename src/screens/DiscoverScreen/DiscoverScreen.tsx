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
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> { }

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ navigation }) => {
  const styles = DiscoverScreenStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [isInvited, setInvited] = useState<boolean>(loginData?.isInvited || false)

  return (
    <SafeAreaView style={styles.container}>
      {loginData.isSignUpCompleted ?
        <AfterAppStaticComponent
          title={LABLE.YOU_ARE_ON_WAITLIST}
          subTitle={LABLE.FULL_ACCESS_UNLOCK} />
        :
        <BeforeAppStaticComponent
          title={LABLE.ACCESS_THE_MOST_VALUABLE_CALENDAR}
          subTitle={LABLE.DISCOVER_EXPERIENCES_IN_ART} />
      }

    </SafeAreaView>
  );
};

export default DiscoverScreen;

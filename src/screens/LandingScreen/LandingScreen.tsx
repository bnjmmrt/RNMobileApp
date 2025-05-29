/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BUTTON_LABLE } from '../../utils/constants';
import { changeSafeAreaViewConfig } from '../..//utils/functions';
import Video from 'react-native-video';
import IMAGES from '../../assets/images/index';
import LandingStyles from './LandingStyles';
import Button from '../../component/Button';
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

// Define the type for navigation props
interface LandingScreenProps extends NativeStackScreenProps<any, any> {}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const styles = LandingStyles();

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
        showTopSafeAreaView: false,
        topSafeAreaViewColor: 'transparent',
        translucent: true,
        showBottomSafeAreaView: false,
        bottomSafeAreaViewColor: 'transparent',
      });
    }, [navigation]),
  );

  const onEnterClick = () => {
    navigation.navigate('EmailPhoneScreen');
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor="black" barStyle="light-content" /> */}
      <StatusBar hidden={true} />
      <Video
        source={IMAGES.introVideo}
        style={StyleSheet.absoluteFillObject} // Full-screen background
        resizeMode="cover" // Adjust to "contain", "stretch", or "none" if needed
        repeat // Loop the video
        muted // Mute the video
        playInBackground={false} // Disable background playback
        playWhenInactive={false} // Pause video when the app is inactive
      />
      <View style={styles.overlayContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image source={IMAGES.monogram} style={styles.logoImgStyle} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.ENTER}
            colorTheme={'light'}
            onPress={onEnterClick}
          />
        </View>
      </View>
    </View>
  );
};

export default LandingScreen;

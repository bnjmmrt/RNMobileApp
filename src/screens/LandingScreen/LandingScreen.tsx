import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Linking, Image, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE } from '../../utils/constants';
import { changeSafeAreaViewConfig, LINKS } from '../..//utils/functions';
import Video from 'react-native-video';
import IMAGES from '../../assets/images/index';
import LandingStyles from './LandingStyles';
import Button from '../../component/Button';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
// Define the type for navigation props
interface LandingScreenProps extends NativeStackScreenProps<any, any> { }

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const styles = LandingStyles();
  const bottomSheetRef = useRef(null);

  // useFocusEffect(
  //   useCallback(() => {
  //     changeSafeAreaViewConfig({ ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME, showTopSafeAreaView: false });
  //     return () => {
  //       // Optional cleanup when screen is unfocused
  //       changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
  //     };
  //   }, [])
  // );


  const onEnterClick = () => {
    navigation.navigate('EmailPhoneScreen')
  }

  const handleOpenWebView = () => {
    bottomSheetRef?.current?.open();
  };


  return (

    <SafeAreaView style={styles.container}>
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
            title={BUTTON_LABLE.APPLY_TO_BE_HOST}
            colorTheme={'dark'}
            onPress={handleOpenWebView}
          />

          <View style={{ height: Hp(2) }} />

          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.ENTER}
            colorTheme={'light'}
            onPress={onEnterClick}
          />

        </View>

        <WebViewBottomSheet url={LINKS.APPLY_FOR_HOST} ref={bottomSheetRef} />


      </View>


    </SafeAreaView>
  );
};

export default LandingScreen;

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Linking, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE } from '../../utils/constants';
import { LINKS } from '../..//utils/functions';
import Video from 'react-native-video';
import IMAGES from '../../assets/images/index';
import LandingStyles from './LandingStyles';
import Button from '../../component/Button';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import WebView from 'react-native-webview';
// Define the type for navigation props
interface LandingScreenProps extends NativeStackScreenProps<any, any> { }

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const styles = LandingStyles();
  const webViewSheetRef = useRef(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const onEnterClick = () => {
    navigation.navigate('EmailPhoneScreen')
  }

  const handleOpenWebView = () => {
    setShowBottomSheet(true);
  };

  const onChangeBottomSheet = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
}


  return (

    <View style={styles.container}>

<WebView
  source={{ uri: LINKS.APPLY_FOR_HOST }}
  style={styles.webViewStyle}
  onError={(e) => console.error('WebView error: ', e.nativeEvent)}
  onHttpError={(e) => console.error('HTTP error: ', e.nativeEvent)}
/>

<View style={{ flex: 1, justifyContent: 'center',backgroundColor:'green', width: '100%',height: '100%' }}>

</View>
{/* 

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
        {
          showBottomSheet && <WebViewBottomSheet url={LINKS.APPLY_FOR_HOST}  onChange= {onChangeBottomSheet}/>
        }

      </View> */}


    </View>
  );
};

export default LandingScreen;

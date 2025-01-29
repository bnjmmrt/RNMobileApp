import React, { useEffect, useRef, useState } from 'react';
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
import {
  setCreativeFocus,
  setInterests,
} from '../../redux/slices/appFlowApiDataSlice';
import useApi from 'src/axios/useApi';
import { useDispatch } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';

// Define the type for navigation props
interface LandingScreenProps extends NativeStackScreenProps<any, any> { }

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const {apiRequest, loading, error} = useApi();
  const dispatch = useDispatch();
  const styles = LandingStyles();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null);

    const fetch = async () => {
      const focusResponse:any = await apiRequest('get', EndPoint.get_focuses);
      dispatch(setCreativeFocus(focusResponse.data));
      console.log("focusResponse")
      const interestResponse:any = await apiRequest('get', EndPoint.interests);
      dispatch(setInterests(interestResponse.data));
      console.log("interestResponse",interestResponse)
    };

    useEffect(() => {
        fetch();
      }, []);

  const onEnterClick = () => {
    navigation.navigate('EmailPhoneScreen')
  }

  const handleOpenWebView = () => {
    bottomSheetRef?.current?.open();
  };

  const onChangeBottomSheet = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  }


  return (

    <View style={styles.container}>
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
        
        <WebViewBottomSheet  url={LINKS.APPLY_FOR_HOST} ref={bottomSheetRef} />
        

      </View>


    </View>
  );
};

export default LandingScreen;

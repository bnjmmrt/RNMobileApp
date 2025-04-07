import React, { useCallback } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Wp, Hp, fontScale, verticalScale } from '../utils/dimensions';
import IMAGES from '../assets/images/index';
import Button from './Button';
import {
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  LABLE,
} from 'src/utils/constants';
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
// import RNRestart from 'react-native-restart'
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import NetInfo from '@react-native-community/netinfo';
// import { DevSettings } from 'react-native';
import MainNavigation from 'src/navigation';

const NoInternetScreen: React.FC = () => {
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
    }, []),
  );

  const handlePress = () => {
    NetInfo.fetch().then(state => {
      if (state?.isInternetReachable) {
        console.log('Internet Available', 'You are connected to the internet.');
        return <MainNavigation />;
        // DevSettings.reload(); 
        // RNRestart.restart(); 
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={IMAGES.backgroundLogin} style={styles.imageStyle} />
      <View style={styles.blurview}></View>
      <View style={styles.messageContainer}>
        <Image source={IMAGES.wifi_off} />
        <Text style={styles.message}>{LABLE.YOU_ARE_OFFLINE}</Text>
        <Text style={styles.description}>{ERROR_MESSAGE.NO_INTERNET}</Text>
      </View>
      <View style={styles.btnView}>
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.RELOAD}
          textStyle={styles.btnTextStyle}
          onPress={() => handlePress()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flex: 1,
  },
  blurview: {
    position: 'absolute',
    flex: 1,
    backgroundColor: COLORS.transperantBackground,
    width: '100%',
    height: '100%',
  },
  message: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    lineHeight: verticalScale(40),
    marginTop: verticalScale(24),
  },
  description: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: verticalScale(8),
    lineHeight: 16,
  },
  btnStyle: {
    // width: Wp(85),
    borderRadius: 100,
    marginTop: Hp(5),
  },
  btnTextStyle: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },

  btnView: {
    position: 'absolute',
    bottom: Hp(5),
  },
});

export default NoInternetScreen;

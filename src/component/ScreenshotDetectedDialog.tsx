import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalScale,
  radiusScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import IMAGES from '@images/index';
import { addListener } from 'react-native-screenshot-prevent';
import FastImage from '@d11/react-native-fast-image';
// import RNPreventScreenshot from 'react-native-screenshot-prevent';

const ScreenshotDetectedDialog: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    addListener(() => {
      setVisible(true);
    });

    return () => {};
  }, []);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => setVisible(false)}>
      <View style={styles.content}>
        <FastImage
          source={IMAGES.rumorLogo}
          style={styles.rumorLogo}
          tintColor={COLORS.black}
        />
        <View style={styles.logoContainer}>
          <FastImage
            source={IMAGES.camera_off}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Screen Capture Detected</Text>
        <Text style={styles.description}>
          Screenshots and screen recordings are not permitted. As a reminder,
          Rumor is a private community and unauthorized screen captures may
          result in suspension or termination of your membership.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.transperantBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: horizontalScale(16),
  },
  rumorLogo: {
    height: 16,
    width: 102,
    zIndex: 1000000,
    marginBottom: verticalScale(40),
  },
  content: {
    paddingHorizontal: horizontalScale(24),
    paddingBottom: verticalScale(82),
    paddingTop: verticalScale(82),
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(32),
  },
  closeButton: {
    position: 'absolute',
    top: verticalScale(24),
    right: verticalScale(24),
    padding: verticalScale(8),
    zIndex: 1,
  },
  closeIcon: {
    width: verticalScale(20),
    height: verticalScale(20),
    tintColor: COLORS.black,
  },
  logoContainer: {
    width: verticalScale(128),
    height: verticalScale(128),
    backgroundColor: COLORS.bgRed,
    borderRadius: verticalScale(300),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  logo: {
    width: verticalScale(32),
    height: verticalScale(32),
  },
  title: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: fontScale(32),
    color: COLORS.black,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  description: {
    fontFamily: fontFamily.ABCDiatype_Regular,
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    textAlign: 'center',
    lineHeight: verticalScale(24),
    maxWidth: '90%',
  },
});

export default ScreenshotDetectedDialog;

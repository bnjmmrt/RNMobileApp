/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import IMAGES from '@images/index';
import { StyleSheet, View, Text, Image } from 'react-native';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import {
  fontScale,
  horizontalScale,
  verticalScale,
  horizontalMarginScale,
  verticalMarginScale,
  radiusScale,
} from 'src/utils/dimensions';

export type MessageType = 'success' | 'error' | 'info' | 'warning';

export const getFlashMessageBackgroundColor = (type: MessageType) => {
  let backgroundColor: string;
  switch (type) {
    case 'success':
      backgroundColor = '#1F1F1F';
      break;
    case 'error':
      backgroundColor = '#EE6055';
      break;
    case 'info':
      backgroundColor = '#2196F3';
      break;
    case 'warning':
      backgroundColor = '#FFC107';
      break;
    default:
      backgroundColor = '#000';
  }
  return backgroundColor;
};

const getIconForType = (type: MessageType) => {
  switch (type) {
    case 'success':
      return IMAGES.checkCircleFilled;
    case 'error':
      return IMAGES.alertTriangle;
    case 'info':
      return IMAGES.info_filled;
    case 'warning':
      return IMAGES.alert_triangle_filled;
    default:
      return IMAGES.checkCircleFilled;
  }
};

export const FlashMessageComponent = {
  show: (
    type: MessageType,
    message: string,
    position: 'top' | 'bottom' = 'bottom',
  ) => {
    showMessage({
      message: '',
      type: 'default',
      backgroundColor: 'transparent',
      color: '#fff',
      duration: 3000,
      style: {
        marginVertical: 0,
        paddingVertical: 0,
      },
      position: position,
      renderCustomContent: () => (
        <View
          style={[
            styles.container,
            position === 'top'
              ? { marginTop: 20, marginBottom: 0 }
              : { marginBottom: 0, marginTop: 0 },
          ]}>
          <View style={styles.toastContainer}>
            <Image source={getIconForType(type)} style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      ),
    });
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: horizontalMarginScale(16),
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
    borderRadius: radiusScale(6),
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    minWidth: horizontalScale(150),
    maxWidth: '90%',
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    tintColor: COLORS.white,
    marginRight: horizontalMarginScale(4),
  },
  message: {
    color: COLORS.white,
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontSize: fontScale(14),
  },
});

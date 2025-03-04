import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, Image, Platform } from 'react-native';
import { COLORS } from '../../utils/constants';
import IMAGES from '../../assets/images';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface ToastProps {
  message: String;
  onClose: () => void;
  toastStyle?: any
}
const Toast: React.FC<ToastProps> = ({ message, onClose, toastStyle }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in/out animation

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }, toastStyle]}>

      <TouchableOpacity onPress={onClose}>
        <Image source={IMAGES.close} style={styles.closeButton} />
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>

    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgBackArrow,

  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  toast: {
    height: 48,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 10: 35,
    left: horizontalMarginScale(20),
    right: horizontalMarginScale(20),
    backgroundColor: COLORS.bgRed,
    borderRadius: radiusScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // shadowOffset: {width: 0, height: 2},
    // elevation: 5,
  },
  message: {
    fontSize: fontScale(14),
    flex: 1,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  closeButton: {
    fontSize: fontScale(14),
    fontWeight: 'bold',
    margin: verticalMarginScale(10),
  },
});

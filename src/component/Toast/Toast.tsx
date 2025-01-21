import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, Animated, Image} from 'react-native';
import { COLORS } from '../../utils/constants';
import IMAGES from '../../assets/images';

interface ToastProps {
  message: String;
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({message, onClose}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in/out animation

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.toast, {opacity: fadeAnim}]}>
      
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
    fontSize: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor:COLORS.bgRed,
    borderRadius: 5,
    padding: 10,
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
    fontSize: 16,
    flex: 1,
    color:COLORS.black
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
});

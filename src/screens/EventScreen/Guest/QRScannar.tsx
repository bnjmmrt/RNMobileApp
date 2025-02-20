import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {COLORS} from 'src/utils/constants';
import {fontScale, radiusScale, verticalMarginScale} from 'src/utils/dimensions';
import IMAGES from '@images/index';
import Button from 'src/component/Button';

const {width} = Dimensions.get('window');
const SQUARE_SIZE = width * 0.8;

const QRCodeScanner = () => {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const requestPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted');
  };
  useEffect(() => {
    requestPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (!scanned) {
        setScanned(true);
        Alert.alert('QR Code Scanned', codes[0].value, [
          {text: 'OK', onPress: () => navigation.navigate('GuestCheckInScreen')},
        ]);
      }
    },
  });
  if (!hasPermission) {
    return (
      <View style={styles.btnContainer}>
        <Text>Camera permission is required</Text>
        <Button
          imageSource={IMAGES.settings}
          style={styles.btn}
          colorTheme="dark"
          title="Give Access"
          onPress={() => requestPermission()}
        />
      </View>
    );
  }

  if (!device) return <Text>Loading Camera...</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
      />
      <View style={styles.overlayContainer}>
        <View style={styles.overlay} />
        <View style={[styles.scannerBox]} />
        <View style={styles.overlay} />
      </View>
    </View>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  btnContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  btn: {width: '60%', marginVertical: verticalMarginScale(20)},
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.black,
    width: '100%',
  },
  scannerBox: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderWidth: 5,
    borderColor: COLORS.white,
    borderRadius:radiusScale(25),
  },
  closeText: {
    color: COLORS.white,
    fontSize:fontScale(18),
  },
});

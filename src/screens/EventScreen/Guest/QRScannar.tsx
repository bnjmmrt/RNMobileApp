import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import IMAGES from '@images/index';
import Button from 'src/component/Button';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { ROUTES } from 'src/navigation/Route';
import { Image } from 'react-native-animatable';
import FullScreenLoader from 'src/component/FullScreenLoader';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.6;

const QRCodeScanner = () => {
  const navigation = useNavigation();
  const { apiRequest, loading, error } = useApi();
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

  const validateQR = async (token: string) => {
    const requestObject = { ticketToken: token };
    const response: any = await apiRequest(
      'post',
      EndPoint.validate_qr,
      requestObject,
    );
    if (response.status === 200) {
      if (response.data.eventQr) {
        navigation.replace(ROUTES.GuestCheckInScreen, {
          guestId: response.data.guestId,
        });
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (!scanned) {
        setScanned(true);
        if (codes[0].value) validateQR(codes[0].value);

        // Alert.alert('QR Code Scanned', codes[0].value, [
        //   {
        //     text: 'OK',
        //     onPress: () => validateQR(codes[0].value)
        //   },
        // ]);
      }
    },
  });

  const onClose = () => navigation.goBack();

  const onMenuClick = () => {};
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
  if (loading)
    return (
      <FullScreenLoader loading={loading} customStyle={{ backgroundColor: COLORS.transperantBackground,}}>
        {null}
      </FullScreenLoader>
    );

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
        <View style={styles.scannerBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Image source={IMAGES.close_gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuIcon} onPress={onMenuClick}>
          <Image source={IMAGES.menu_gray} />
        </TouchableOpacity>
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
    backgroundColor: COLORS.transperantBackground,
  },
  btnContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: { width: '60%', marginVertical: verticalMarginScale(20) },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  closeIcon: {
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  menuIcon: {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
  },
  closeText: {
    color: COLORS.white,
    fontSize: fontScale(18),
  },
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.transperantBackground,
  },
  scannerBox: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'absolute',
    borderRadius: radiusScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: horizontalScale(65),
    height: verticalScale(65),
    borderColor: COLORS.white,
    borderWidth: 3.5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopLeftRadius: radiusScale(25),
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopRightRadius: radiusScale(25),
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: radiusScale(25),
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: radiusScale(25),
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  validationText:{ flex: 1, justifyContent: 'center', alignItems: 'center' }
});

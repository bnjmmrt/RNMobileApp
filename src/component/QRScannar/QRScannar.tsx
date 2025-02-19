import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';

const QRCodeScanner = () => {
  const device = useCameraDevice('back');
  const cameraRef = useRef<any>(null);
  const [scannedData, setScannedData] = useState<any | null>(null);
  console.log('devicedevicedevicedevice', useCameraDevices());

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
    },
  });

  if (!device) return <Text>Loading Camera...</Text>;

  return (
    <View style={styles.container}>
      <Text>QR code scanner</Text>
      <Camera
        ref={cameraRef}
        isActive={true}
        device={device}
        codeScanner={codeScanner}
        onPreviewStarted={() => console.log('Preview started!')}
        onPreviewStopped={() => console.log('Preview stopped!')}
      />

      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.scannedText}>Scanned: {scannedData}</Text>
        </View>
      )}
    </View>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({
  container: {flex: 1},
  overlay: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

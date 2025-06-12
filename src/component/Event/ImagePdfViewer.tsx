import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { ANNOUNCEMENT, BUTTON_LABLE, COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import Button from '../Button';
import Share from 'react-native-share';

interface MediaItem {
  mediaType: 'image' | 'pdf';
  media?: any;
  mediaName?: any;
  size?: string;
}

interface ImagePdfViewerProps {
  visible: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  name: string;
  logo: string;
  index: number;
}
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

const ImagePdfViewer: React.FC<ImagePdfViewerProps> = ({
  visible,
  onClose,
  mediaItems,
  name,
  logo,
  index,
}) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [loader, setLoader] = useState(false);
  const bottomSheetRef = useRef(null);
  const folderName = 'TheRumor';
  const folderPath = `${RNFS.DocumentDirectoryPath}/${folderName}`;
  // const folderPath = `${RNFS.ExternalStorageDirectoryPath}/Documents/${folderName}`;
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to download the file',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Cannot download file without storage permission',
        );
        return;
      }
    }
    return true;
  };

  const downloadAndShareFile = async () => {
    try {
      const fileUrl = mediaItems[currentIndex]?.media;
      const fileName = mediaItems[currentIndex]?.mediaName;
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localFilePath,
      }).promise;
      if (downloadResult.statusCode === 200) {
        setLoader(false);
        console.log('Download complete:', localFilePath);
        await Share.open({
          url: 'file://' + localFilePath,
          type:
            mediaItems[currentIndex]?.mediaType === 'pdf'
              ? 'application/pdf'
              : 'image/jpeg', // Change based on file type
          saveToFiles: true, // :point_left: this enables the "Save to Files" option in iOS
        });
      } else {
        setLoader(false);
        // Alert.alert('Download Failed', `Status code: ${downloadResult.statusCode}`);
      }
    } catch (err) {
      setLoader(false);
      console.error('Error downloading or sharing file:', err);
      // Alert.alert('Error', 'Something went wrong while downloading or sharing the file.');
    }
  };

  const createFolder = async () => {
    setLoader(true);
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to save files.',
      );
      return;
    }
    try {
      if (Platform.OS === 'android') {
        downloadFile();
      } else {
        downloadAndShareFile();
      }
    } catch (err) {
      setLoader(false);
      console.error('Error creating folder:', err);
    }
  };

  const downloadFile = async () => {
    const folderPathNew = `${RNFS.DownloadDirectoryPath}`;
    const fileName = mediaItems[currentIndex]?.mediaName;
    const destPath = `${folderPathNew}/${fileName}`;
    try {
      const options = {
        fromUrl: mediaItems[currentIndex]?.media,
        toFile: destPath,
      };

      const result = await RNFS.downloadFile(options).promise;
      if (result.statusCode === 200) {
        setLoader(false);
        console.log('File downloaded successfully:', destPath);
        Alert.alert('Success', `File downloaded to ${destPath}`);
      } else {
        setLoader(false);
        Alert.alert(
          'Error',
          `Download failed with status ${result.statusCode}`,
        );
      }
    } catch (err) {
      setLoader(false);
      console.error('Download error:', err);
      Alert.alert('Download failed', err.message);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const openPdfInBrowser = async (pdfUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Cannot open this PDF link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening the PDF.');
    }
  };
  
  const renderMedia = () => {
    const currentItem = mediaItems[currentIndex];
    console.log('currentItem?.media', currentItem);
    if (currentItem?.mediaType === 'image') {
      return (
        <FastImage
          source={{ uri: currentItem?.media }}
          style={styles.media}
          resizeMode="contain"
        />
      );
    } else if (currentItem?.mediaType === 'pdf') {
      return (
        <>
          {/* <WebViewBottomSheet url={currentItem?.media} ref={bottomSheetRef} isFromLanding={true} /> */}

          <Pressable
            style={styles.pdfContainer}
            onPress={() => openPdfInBrowser(currentItem?.media)}>
            {currentItem.media ? (
              <Pdf
                source={{
                  uri: currentItem.media,
                }}
                renderActivityIndicator={() => <View />}
                singlePage
                style={styles.pdfDisplay}
              />
            ) : (
              <>
                <Image
                  source={IMAGES.pdf}
                  style={styles.pdfIcon}
                  resizeMode="contain"
                />
                <Text style={styles.pdfText}>{currentItem?.mediaName}</Text>
              </>
            )}
            {/* <Text style={styles.pdfSize}>{currentItem.size}</Text> */}
          </Pressable>
        </>
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}>
            <Image resizeMode="contain" source={IMAGES.cross} />
          </TouchableOpacity>
          <Text style={styles.mediaInfo}>
            {currentIndex + 1} of {mediaItems.length}
          </Text>
        </View>

        <View style={styles.mediaContainer}>{renderMedia()}</View>
        {mediaItems.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
                <Image
                  source={IMAGES.leftArrow}
                  style={styles.arrowIcon}
                  resizeMode="center"
                />
              </TouchableOpacity>
            )}
            {currentIndex < mediaItems.length - 1 && (
              <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
                <Image
                  source={IMAGES.arrowRight}
                  style={styles.arrowIcon}
                  resizeMode="center"
                />
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={[styles.footer]}>
          <View style={[styles.container]}>
            <FastImage
              style={[styles.image]}
              source={{ uri: logo }}
              defaultSource={IMAGES.backgroundLogin}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.subtitle}>{ANNOUNCEMENT.POSTED_BY}</Text>
              <Text style={styles.title}>{name}</Text>
            </View>
          </View>
          {/* <Button
                        disabled={false}
                        style={styles.btnStyle}
                        title={BUTTON_LABLE.SAVE_TO_FILE}
                        colorTheme="light"
                        onPress={handleNext}
                    /> */}

          <Button
            disabled={false}
            style={[styles.btnStyle, styles.fullWidth]}
            title={BUTTON_LABLE.SAVE_TO_FILE}
            colorTheme="light"
            loading={loader}
            onPress={() => createFolder()}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImagePdfViewer;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 40,
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: 20,
    backgroundColor: COLORS.white, // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalMarginScale(20),
    position: 'absolute',
    top: 10,
    left: 10,
    resizeMode: 'contain',
  },
  icon: {
    width: 10,
    height: 10,
  },
  mediaInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 50,
    flex: 1,
  },
  mediaContainer: {
    width: width * 0.9,
    height: height * 0.7,
    // justifyContent: "center",
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '92%',
    borderRadius: 10,
    objectFit: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContainer: {
    width: '100%',
    height: '92%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  pdfDisplay: {
    width: '100%',
    height: '100%',
  },
  pdfIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  pdfText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  pdfSize: {
    color: 'gray',
    fontSize: 14,
    marginTop: 5,
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    backgroundColor: COLORS.white,
    borderRadius: 40,
    transform: [{ translateY: -20 }],
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    backgroundColor: COLORS.white,
    borderRadius: 40,
    transform: [{ translateY: -20 }],
  },
  arrowIcon: {
    width: 40,
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    gap: 10,
    alignItems: 'center',
    width: width * 0.9,
  },
  btnStyle: {
    borderRadius: 100,
  },
  container: {
    borderWidth: 2,
    padding: verticalMarginScale(8),
    borderRadius: 10,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  image: {
    resizeMode: 'center',
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(20),
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: horizontalMarginScale(8),
    // marginEnd: 20,
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

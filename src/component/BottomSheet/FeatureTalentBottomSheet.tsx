import IMAGES from '@images/index';
import { environment } from 'environments/environment';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { openSettings } from 'react-native-permissions';
import { EndPoint } from 'src/ApiManager/config';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { useUploadFile } from 'src/utils/hooks/useUploadFile';
import BtnBack from '../../assets/svgs/icons/BtnBack.svg';
import ImageErrorPlaceHolder from '../../assets/svgs/icons/ImageErrorPlaceHolder.svg';
import ImagePlaceHolder from '../../assets/svgs/icons/ImagePlaceholder.svg';
import { COLORS } from '../../utils/constants';
import { fontFamily, removeSignature } from '../../utils/functions';
import BottomSheetComponent, {
  BottomSheetMethods,
} from '../BottomSheet/BottomSheet';
import Button from '../Button';
import Input, { InputRefMethods } from '../Input/Input';

interface FeatureTalentBottomSheetProps {
  onPress: (data: {
    id: string;
    name: string;
    imageKeyUrl: string;
    action: string;
  }) => void;
  title?: string;
  image?: string;
  submitButtonText: string;
  cancelButtonText: string;
  snapPoints: any;
  talent?: { id?: string; name?: string; imageKeyUrl?: string } | null;
  onClose?: () => void;
}

const FeatureTalentBottomSheet = forwardRef<
  BottomSheetMethods,
  FeatureTalentBottomSheetProps
>((props, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const inputRef = useRef<InputRefMethods>(null);
  const [image, setImage] = useState(props?.image || '');
  const [imageError, setImageError] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  // useEffect(() => {
  //   if (props?.talent?.imageKeyUrl) {
  //     setImage(props.talent?.imageKeyUrl || '');
  //   }
  // }, [props]);

  const { uploadFileHook } = useUploadFile();
  const [imageSize, setImageSize] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);

  const openCamera = async () => {
    ImagePicker.openPicker({
      width: 120,
      height: 120,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image: ImageOrVideo) => {
        setImage('');
        setImageError(false); // Clear error on selection
        savePhoto(image.path);
      })
      .catch(async error => {
        console.log('ImagePicker Error: ', error);

        if (error?.message?.includes('did not grant library permission')) {
          Alert.alert(
            'Permission Required',
            'We need access to your photo library to allow you to add a picture. Please enable photo library permissions in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: async () => {
                  openSettings();
                },
              },
            ],
          );
        }
      });
  };

  const savePhoto = async (image: any) => {
    setLoader(true);
    try {
      const data = await fetch(image);
      const blob = await data.blob();
      const fileName = image.split('/').pop();
      const pathType = 'feature-talent';
      const response = await uploadFileHook(
        fileName,
        imageSize,
        'image',
        blob,
        pathType,
      );
      if (response.success) {
        const imageUrl =
          environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        setImage(imageUrl);
      } else {
        setImageError(true);
        console.log('savePhoto else', response);
      }
      setLoader(false);
      console.log('savePhoto', response);
    } catch (error) {
      setLoader(false);
      console.error('Error uploading image:', error);
    }
  };

  const handleSave = () => {
    const isNameValid = inputRef.current?.validateInputs();

    if (!image) {
      setImageError(true);
    }

    if (isNameValid && image) {
      props.onPress({
        id: props.talent?.id || Date.now().toString(),
        name: inputRef.current.inputText,
        imageKeyUrl: image,
        action: props.talent ? 'update' : 'create',
      });
    }
  };

  const closeSheet = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      footer={
        <View style={{ marginTop: 'auto', gap: 8 }}>
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={'Save'}
            colorTheme="dark"
            onPress={handleSave}
          />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={props.cancelButtonText}
            colorTheme="dark"
            onPress={closeSheet}
            clearButtonStyle={styles.clearButton}
            textStyle={{ color: '#000' }}
          />
        </View>
      }
      snapPoints={[imageError ? '60%' : '55%']}
      onClose={() => closeSheet()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => closeSheet()}>
            <BtnBack height={32} width={32} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {props.talent ? 'Edit Featured Talent' : 'Add Featured Talent'}
          </Text>
        </View>

        <View style={styles.profilePhotoContainer}>
          {loader ? (
            <ActivityIndicator color={COLORS.black} />
          ) : image ? (
            <Image
              source={{ uri: removeSignature(image) }}
              style={styles.profilePhoto}
            />
          ) : imageError ? (
            <ImageErrorPlaceHolder height={96} width={96} />
          ) : (
            <ImagePlaceHolder height={96} width={96} />
          )}
          <TouchableOpacity style={styles.iconContainer} onPress={openCamera}>
            <Image
              resizeMode="contain"
              source={IMAGES.pencil}
              style={styles.ic_pencil}
            />
          </TouchableOpacity>
        </View>

        {imageError && (
          <Text style={styles.errorText}>
            Upload an image of your talent{'\n'}Only JPG or PNG, Under 5 MB
          </Text>
        )}
        {/* <TextInput
          placeholder='Gejhejkrhh'
          defaultValue={props?.talent?.name || ''}
        /> */}
        <Input
          ref={inputRef}
          forBottomSheet
          defaultValue={props?.talent?.name || ''}
          label="Talent Name"
          errorMessage={'Talent name is required'}
        />
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(32),
    marginBottom: verticalMarginScale(16),
  },
  btnStyle: {
    borderRadius: fontScale(100),
  },
  clearButton: {
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  profilePhotoContainer: {
    height: verticalScale(96),
    width: verticalScale(96),
    borderRadius: radiusScale(100),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePhoto: {
    height: '100%',
    width: '100%',
    borderRadius: radiusScale(100),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 50,
    width: 32,
    height: 32,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  ic_pencil: {
    height: verticalScale(16),
    width: horizontalScale(16),
    tintColor: COLORS.white,
  },
  errorText: {
    color: COLORS.errorText,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginTop: 4,
  },
});

export default FeatureTalentBottomSheet;

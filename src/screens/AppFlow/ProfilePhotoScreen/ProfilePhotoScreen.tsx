import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE, PERMISSION, MAX_IMAGE_SIZE_BYTES } from '../../../utils/constants';
import ProfilePhotoScreenStyles from './ProfilePhotoScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import {
  setPageProgress,
  setProfilePic,
} from '../../../redux/slices/appFlowSlice';
import IMAGES from '../../../assets/images';
import Toast from '../../../component/Toast/Toast';
import useApi from '../../../axios/useApi';
import { EndPoint } from '../../../ApiManager/config';
import AvatarInitials from '../../../component/AvatarInitials';
import { environment } from '../../../../environments/environment';
import EditPictureBottomSheet from '../../../component/BottomSheet/EditPictureBottomSheet';
import FullScreenLoader from 'src/component/FullScreenLoader';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { openSettings } from 'react-native-permissions';
import { verticalMarginScale } from 'src/utils/dimensions';
import { useUploadFile } from 'src/utils/hooks/useUploadFile';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> { }

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const [loader, setLoading] = useState(false);
  const dispatch = useDispatch();
  const profilePic = useSelector(
    (state: RootState) => state.appFlow.profilePic,
  );
  const styles = ProfilePhotoScreenStyles();

  const [image, setImage] = useState<string>(profilePic);
  const [imageSize, setImageSize] = useState<number>(0);

  const [isToastShown, setIsToastShown] = useState(false);
  const [isUplaodProfile, setIsUploadProfile] = useState(false);
  const userDetails = useSelector((state: any) => state.appFlow);
  const savePhotoBottomSheetRef = useRef<any>(null);
  const { uploadFileHook } = useUploadFile();

  // const uploadFile = async () => {
  //   const mimeType = `images/${image.split('.').pop()}`;
  //   const fileName = image.split('/').pop();

  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri: image,
  //     type: mimeType,
  //     name: fileName,
  //   });

  //   return await apiRequest('post', EndPoint.file_upload, formData, null, {
  //     'Content-Type': 'multipart/form-data',
  //   });
  // };


  const onCancel = () => { setImage('') };
  const savePhoto = async () => {
    try {
      setLoading(true);
      const data = await fetch(image);
      const blob = await data.blob();
      const fileName = image.split('/').pop();
      const pathType = 'profile';
      const response = await uploadFileHook(
        fileName,
        imageSize,
        'image',
        blob,
        pathType,
      );
      if (response.success == true) {
        savePhotoBottomSheetRef.current?.close();
        const imageUrl =
          environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        dispatch(setProfilePic(imageUrl));
      } else {
        console.log('savePhoto else', response);
      }
      // const response: any = await uploadFile(image, size, type, blob);
      console.log('savePhoto', response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image:', error);
    }
  };

  // const savePhoto = async () => {
  //   if (image) {
  //     if (isUplaodProfile) {
  //       // setIsToastShown(false);
  //       savePhotoBottomSheetRef.current?.close();
  //       const response: any = await uploadFile();
  //       if (response.data) {
  //         // setIsToastShown(false);
  //         dispatch(
  //           setProfilePic(
  //             environment.BASE_URL +
  //               EndPoint.view_image +
  //               response.data.fileKeyId,
  //           ),
  //         );
  //       } else {
  //         //display error
  //       }
  //     } else {
  //       dispatch(setPageProgress(9));
  //       navigation.navigate('IdentityVerification');
  //     }
  //   }
  // };
  const onNextClick = async () => {
    if (loader == true) {
      FlashMessageComponent.show(
        'info',
        ERROR_MESSAGE.PLEASE_WAIT,
      );
    } else if (image) {
      dispatch(setPageProgress(9));
      navigation.navigate('IdentityVerification');
    } else {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(7));
    navigation.goBack();
  };

  const openPicker = () => {
    console.log('open');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image: ImageOrVideo) => {

        if (image.size && image.size <= MAX_IMAGE_SIZE_BYTES) {
          setImage(image.path);
          setImageSize(image.size);
          setIsToastShown(false);
          setIsUploadProfile(true);
          savePhotoBottomSheetRef.current?.open();  
        } else {
          Alert.alert(
            'Image Size Error',
            'Please select an image that is under 5MB in size.',
            [{ text: 'OK' }]
          );          
        }
      })
      .catch(async error => {
        console.log('ImagePicker Error: ', error);

        if (error?.message?.includes('did not grant library permission')) {
          Alert.alert(
            PERMISSION.PERMISSION_REQUIRED,
            PERMISSION.GALLERY_PERMISSION,
            [
              {
                text: BUTTON_LABLE.CANCEL,
                style: 'cancel',
              },
              {
                text: PERMISSION.OPEN_SETTING,
                onPress: async () => {
                  openSettings();
                },
              },
            ],
          );
        }
      });
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.PROFILE_PHOTO} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.ADD_A_PHOTO}
          subTitle={LABLE.ADD_A_PHOTO_SUBTITLE}
        />

        <View
          style={[
            styles.profilePhotoContainer,
            { marginTop: verticalMarginScale(24) },
          ]}>
          <FullScreenLoader
            loading={loading || loader}
            customStyle={styles.profilePhotoContainer}>
            {image ? (
              <Image
                style={styles.profilePhotoContainer}
                source={{ uri: profilePic }}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profilePhotoContainer}>
                <AvatarInitials
                  name={userDetails?.firstName + ' ' + userDetails?.lastName}
                  size={48}
                  listing={false}
                />
              </View>
            )}
          </FullScreenLoader>

          <TouchableOpacity style={styles.iconContainer} onPress={openPicker}>
            <Image
              resizeMode="contain"
              source={IMAGES.pencil}
              style={styles.ic_pencil}
            />
          </TouchableOpacity>
          <EditPictureBottomSheet
            ref={savePhotoBottomSheetRef}
            onPress={savePhoto}
            onPencilClick={openPicker}
            loadding={loader}
            onCancel={onCancel}
            submitButtonText={BUTTON_LABLE.SAVE_PHOTO}
            cancelButtonText={BUTTON_LABLE.CANCEL}
            snapPoints={[Platform.OS == 'android' ? 0.5 : 0.45]}
            image={image}
          />
        </View>
        {/* Render profile photo */}
        {isToastShown && (
          <Toast
            toastStyle={{ bottom: 50 }}
            message={ERROR_MESSAGE.UPLOAD_PHOTO}
            onClose={() => setIsToastShown(false)}
          />
        )}
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        loading={loading}
        onPress={onNextClick}
      />
    </View>
  );
};

export default ProfilePhotoScreen;

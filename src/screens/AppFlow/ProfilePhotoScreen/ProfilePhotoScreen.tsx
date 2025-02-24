import React, { useCallback, useRef, useState } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
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

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> { }

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({
  navigation,
}) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const profilePic = useSelector(
    (state: RootState) => state.appFlow.profilePic,
  );
  const styles = ProfilePhotoScreenStyles();

  const [image, setImage] = useState<string>(profilePic);
  const [isToastShown, setIsToastShown] = useState(false);
  const [isUplaodProfile, setIsUploadProfile] = useState(false);
  const userDetails = useSelector((state: any) => state.appFlow);
  const savePhotoBottomSheetRef = useRef<any>(null);

  const uploadFile = async () => {
    const mimeType = `images/${image.split('.').pop()}`;
    const fileName = image.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: mimeType,
      name: fileName,
    });

    return await apiRequest('post', EndPoint.file_upload, formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  };

  const savePhoto = async () => {
    if (image) {
      if (isUplaodProfile) {
        // setIsToastShown(false);
        savePhotoBottomSheetRef.current?.close();
        const response: any = await uploadFile();
        if (response.data) {
          // setIsToastShown(false);
          dispatch(
            setProfilePic(
              environment.BASE_URL +
              EndPoint.view_image +
              response.data.fileKeyId,
            ),
          );
        } else {
          //display error
        }
      } else {
        dispatch(setPageProgress(9));
        navigation.navigate('IdentityVerification');
      }
    }
  };
  const onNextClick = async () => {
    if (image) {
      dispatch(setPageProgress(9));
      navigation.navigate('IdentityVerification');
    }
    {
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
    }).then((image: ImageOrVideo) => {
      setImage(image.path);
      setIsToastShown(false);
      setIsUploadProfile(true);
      savePhotoBottomSheetRef.current?.open();
    });
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.PROFILE_PHOTO} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.ADD_A_PHOTO}
          subTitle={LABLE.ADD_A_PHOTO_SUBTITLE}
        />

        <View style={styles.profilePhotoContainer}>
          <FullScreenLoader
            loading={loading}
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
            submitButtonText={BUTTON_LABLE.SAVE_PHOTO}
            cancelButtonText={BUTTON_LABLE.CANCEL}
            snapPoints={[Platform.OS == 'android' ? '50%' : '50%']}
            image={image}
          />
        </View>
        {/* {loading && <Text>Uploading ...</Text>} */}
        {/* Render profile photo */}
        {isToastShown && (
          <Toast
            message={'Please upload a Profile Photo'}
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
    </SafeAreaView>
  );
};

export default ProfilePhotoScreen;

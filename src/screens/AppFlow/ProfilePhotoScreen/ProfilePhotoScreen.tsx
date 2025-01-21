import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {LABLE, BUTTON_LABLE} from '../../../utils/constants';
import ProfilePhotoScreenStyles from './ProfilePhotoScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {
  setPageProgress,
  setProfilePic,
} from '../../../redux/slices/appFlowSlice';
import IMAGES from '../../../assets/images';
import Toast from '../../../component/Toast/Toast';
import useApi from '../../../axios/useApi';
import {EndPoint} from '../../../ApiManager/config';
import AvatarInitials from '../../../component/AvatarInitials';

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> {}

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({
  navigation,
}) => {
  const {apiRequest, loading, error} = useApi();
  const dispatch = useDispatch();
  const profilePic = useSelector(
    (state: RootState) => state.appFlow.profilePic,
  );

  const styles = ProfilePhotoScreenStyles();
  const [image, setImage] = useState<string>(profilePic);
  const [isToastShown, setIsToastShown] = useState(false);

  const uploadFile = async () => {
    console.log('File uploaded');
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await apiRequest(
        'post',
        EndPoint.file_upload,
        formData,
        null, 
        {'Content-Type': 'multipart/form-data'},
      );
      console.log('File uploaded successfully:', response);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const onNextClick = async () => {
    if (image) {
      //API call
      // uploadFile()
      
      setIsToastShown(false);
      // dispatch(setProfilePic(response.data.pathFileUrl));
      dispatch(setPageProgress(9));
       navigation.navigate('IdentityVerification');

      // if (!error) {
      //   setIsToastShown(false);
      //   // dispatch(setProfilePic(response.data.pathFileUrl));
      //   dispatch(setPageProgress(9));
      //   // navigation.navigate('IdentityVerification');
      // } else {
      //   //display error
      // }
    }
    {
      setIsToastShown(true);
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(7));
    navigation.navigate('SelectInterestScreen');
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
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.PROFILE_PHOTO} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.ADD_A_PHOTO}
          subTitle={LABLE.ADD_A_PHOTO_SUBTITLE}
        />
        {/* {loading && <Text>Loading...</Text>} */}
        <View style={styles.profilePhotoContainer}>
       {image ?  <Image
            style={styles.profilePhotoContainer}
            source={{uri: image}}
            resizeMode="cover"
          /> : (<View style={{alignSelf:"center"}}><AvatarInitials name={"Bessie Cooper"} size={48} /></View>)}
         
          <TouchableOpacity style={styles.iconContainer} onPress={openPicker}>
            <Image
              resizeMode="contain"
              source={IMAGES.pencil}
              style={styles.ic_pencil}
            />
          </TouchableOpacity>
        </View>
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
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default ProfilePhotoScreen;

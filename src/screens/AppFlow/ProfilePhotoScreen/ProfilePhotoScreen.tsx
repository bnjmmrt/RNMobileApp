import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
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

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> {}

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const profilePic = useSelector(
    (state: RootState) => state.appFlow.profilePic,
  );
  const styles = ProfilePhotoScreenStyles();
  const [image, setImage] = useState<string>(profilePic);
  const [isToastShown,setIsToastShown]=useState(false)



  const onNextClick = () => {
    if(image){
      setIsToastShown(false)
      dispatch(setProfilePic(image));
      dispatch(setPageProgress(9));
      navigation.navigate('IdentityVerification');
    }{
      setIsToastShown(true)
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(7));
    navigation.navigate("SelectInterestScreen");
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
      setIsToastShown(false)
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
        <View style={styles.profilePhotoContainer}>
          <Image
            style={styles.profilePhotoContainer}
            source={{uri: image}}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.iconContainer} onPress={openPicker}>
            <Image
              resizeMode="contain"
              source={IMAGES.pencil}
              style={styles.ic_pencil}
            />
          </TouchableOpacity>
        </View>
        {/* Render profile photo */}
        {isToastShown && <Toast message={'Please upload a Profile Photo'} onClose={() => setIsToastShown(false)} />}
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

import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import ProfilePhotoScreenStyles from './ProfilePhotoScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setPageProgress, setProfilePic } from '../../../redux/slices/appFlowSlice';
import IMAGES from '../../../assets/images';

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> { }

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const profilePic = useSelector((state: RootState) => state.appFlow.profilePic);
  const styles = ProfilePhotoScreenStyles();

  const onNextClick = () => {
    //  dispatch(setProfilePic(birthdayRef.current.inputText))
    dispatch(setPageProgress(9))
    navigation.navigate('IdentityVerification');
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(7));
    navigation.navigate('SelectInterestScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.PROFILE_PHOTO} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.ADD_A_PHOTO} subTitle={LABLE.ADD_A_PHOTO_SUBTITLE} />
        <View style={styles.profilePhotoContainer}>
          {!profilePic && <Image
            style={styles.profilePhotoContainer}
            source={IMAGES.backgroundLogin}
            resizeMode="cover"
          />}
          <TouchableOpacity style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              source={IMAGES.pencil}
              style={styles.ic_pencil}
            />
          </TouchableOpacity>
        </View>
        {/* Render profile photo */}

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

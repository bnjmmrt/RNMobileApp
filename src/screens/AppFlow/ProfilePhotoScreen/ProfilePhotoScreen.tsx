import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../../utils/constants';
import ProfilePhotoScreenStyles from './ProfilePhotoScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';

interface ProfilePhotoScreenProps extends NativeStackScreenProps<any, any> { }

const ProfilePhotoScreen: React.FC<ProfilePhotoScreenProps> = ({ navigation }) => {
  const styles = ProfilePhotoScreenStyles();

  const onNextClick = () => {
    navigation.navigate('IdentityVerification');
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.PROFILE_PHOTO} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title title={LABLE.ADD_A_PHOTO} subTitle={LABLE.ADD_A_PHOTO_SUBTITLE} />
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

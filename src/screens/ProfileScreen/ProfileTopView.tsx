import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import { fontFamily, removeSignature } from '../../utils/functions';
import { Wp, Hp } from '../../utils/dimensions';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import AvatarInitials from '../../component/AvatarInitials';
import FullScreenLoader from 'src/component/FullScreenLoader';
import { isIPad } from '../../utils/isTabletConfig';

interface ProfileTopViewProps {
  editPhotoClick: () => void;
  profilePic: any;
  name: string;
  loading?: boolean;
  role: string;
}
const ProfileTopView: React.FC<ProfileTopViewProps> = ({
  editPhotoClick,
  profilePic,
  name,
  loading,
  role,
}) => {
  // Handle the "Next" button press
  const handlEventPress = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.profilePhotoContainer}>
        <FullScreenLoader
          loading={Boolean(loading)}
          customStyle={styles.profilePhotoContainer}>
          {profilePic ? (
            <FastImage
              style={styles.profilePhotoContainer}
              source={{ uri: removeSignature(profilePic) || '' }}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePhotoContainer}>
              <AvatarInitials name={name} size={45} listing={false} />
            </View>
          )}
        </FullScreenLoader>
        <TouchableOpacity style={styles.iconContainer} onPress={editPhotoClick}>
          <FastImage
            resizeMode="contain"
            source={IMAGES.pencil}
            style={styles.ic_pencil}
          />
        </TouchableOpacity>
      </View>
      <TitleSubtitle
        title={name}
        subTitle={role}
        centerTextAlign={!isIPad}
        titleFontSize={38}
        subTitleMargin={5}
        style={{ margin: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    marginTop: 20,
    paddingVertical: 7,
  },
  container: {
    flexDirection: isIPad ? 'row' : 'column',
    padding: 10,
    marginTop: 10,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    alignItems: 'center',
    // height: 100,
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 10,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    // marginRight: 10,
    height: '20%',
    width: '30%',
  },
  titleStyle: {
    fontSize: 22,
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: 5,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 12,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
  profilePhotoContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: COLORS.tabBorderColor,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
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
    height: 16,
    width: 16,
    tintColor: COLORS.white,
  },
});

export default ProfileTopView;

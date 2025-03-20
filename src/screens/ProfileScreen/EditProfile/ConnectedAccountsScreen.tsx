import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import IMAGES from '../../../assets/images';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import { setPageProgress } from '../../../redux/slices/appFlowSlice';
import { BUTTON_LABLE, COLORS, PROFILE } from '../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  Wp,
} from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';

import SocialMediaBottomSheet from 'src/component/BottomSheet/SocialMediaBottomSheet';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import AccountItem from './AccountItem';
interface ConnectedAccountsScreenProps {}

const items: any = [
  { id: '1', title: PROFILE.INSTAGRAM, image: IMAGES.profileInsta },
  // { id: '2', title: PROFILE.TIKTOK, image: IMAGES.profileTiktok },
  // { id: '3', title: PROFILE.FACEBOOK, image: IMAGES.profileFacebook },
  // { id: '4', title: PROFILE.LINKEDIN, image: IMAGES.profileLinkedIn },
  // { id: '5', title: PROFILE.X, image: IMAGES.profileX },
  // { id: '6', title: PROFILE.YOUTUBE, image: IMAGES.profileYoutube },
  // { id: '7', title: PROFILE.SNAPCHAT, image: IMAGES.profileSnapchat },
];

interface ConfigData {
  logo: string;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
  snapPoints?: any;
}

const ConnectedAccountsScreen: React.FC<ConnectedAccountsScreenProps> = () => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();
  const navigation = useNavigation();
  const socialMediaBottomSheetRef = useRef<any>(null);
  //   const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const [selectedItem, setSelectedItem] = useState<any>(); // Initialize with birthday from Redux
  const [configData, setConfigData] = useState<ConfigData>({
    logo: '',
    title: '',
    subTitle: '',
    connectBtnBackground: '',
  });
  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  const getSubTitle = (mediaType: string) => {
    return `By clicking on the button below you’ll be redirected to ${mediaType} – log in with your details to authorize this connection`;
  };
  const getSelectedItem = (item: any) => {
    setSelectedItem(item);
    console.log('itemseleted', item);
    switch (item.title) {
      case PROFILE.INSTAGRAM:
        socialMediaBottomSheetRef.current.open();
        setConfigData({
          logo: IMAGES.instagramLogo,
          title: PROFILE.CONNECT_INSTAGRAM,
          subTitle: 'Please enter your Instagram Handle below',
          connectBtnBackground: COLORS.pink,
          snapPoints: [Platform.OS === 'android' ? '85%' : '85%'],
        });
        break;
      case PROFILE.TIKTOK:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.tiktok,
          title: PROFILE.CONNECT_TIKTOK,
          subTitle: getSubTitle(PROFILE.TIKTOK),
          connectBtnBackground: COLORS.black,
        });
        break;
      case PROFILE.FACEBOOK:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.facebook,
          title: PROFILE.CONNECT_FACEBOOK,
          subTitle: getSubTitle(PROFILE.FACEBOOK),
          connectBtnBackground: COLORS.blue,
        });
        break;
      case PROFILE.LINKEDIN:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.linkedIn,
          title: PROFILE.CONNECT_LINKEDIN,
          subTitle: getSubTitle(PROFILE.LINKEDIN),
          connectBtnBackground: COLORS.darkBlue,
        });
        break;
      case PROFILE.X:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.social_x,
          title: PROFILE.CONNECT_X,
          subTitle: getSubTitle(PROFILE.X),
          connectBtnBackground: COLORS.black,
        });
        break;
      case PROFILE.YOUTUBE:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.youtube,
          title: PROFILE.CONNECT_YOUTUBE,
          subTitle: getSubTitle(PROFILE.YOUTUBE),
          connectBtnBackground: COLORS.red,
        });
        break;
      case PROFILE.SNAPCHAT:
        socialMediaBottomSheetRef?.current?.open();
        setConfigData({
          logo: IMAGES.social_snapchat,
          title: PROFILE.CONNECT_SNAPCHAT,
          subTitle: getSubTitle(PROFILE.SNAPCHAT),
          connectBtnBackground: COLORS.yellow,
        });
        break;
    }
  };

  const onConfirm = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.CONNECTED_ACCOUNTS}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.subTitle}>
            {PROFILE.CONNECTED_ACCOUNTS_SUB_TITLE}
          </Text>
          <View style={styles.listContainer}>
            {items.map((item: any) => {
              return (
                <AccountItem
                  key={item.id}
                  item={item}
                  setItem={getSelectedItem}
                />
              );
            })}
          </View>
          <SocialMediaBottomSheet
            ref={socialMediaBottomSheetRef}
            logo={configData.logo}
            title={configData.title}
            subTitle={configData.subTitle}
            snapPoints={configData.snapPoints}
            connectBtnBackground={configData.connectBtnBackground}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
      {!keyboardVisible ? (
        <Button
          style={styles.btnStyle}
          title={BUTTON_LABLE.CONFIRM}
          colorTheme="dark"
          onPress={onConfirm}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
  },
  contentContainer: {
    flex: 1,
    paddingVertical: horizontalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  listContainer: {
    marginVertical: verticalMarginScale(16),
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(13),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
    marginBottom: verticalMarginScale(16),
  },
});
export default ConnectedAccountsScreen;

import React, {useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {setPageProgress} from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import Button from '../../../component/Button';
import IMAGES from '../../../assets/images';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
  PROFILE,
} from '../../../utils/constants';
import DatepickerBottomSheet from '../../../component/BottomSheet/DatepickerBottomSheet';
import {useNavigation} from '@react-navigation/native';
import {Hp, Wp} from '../../../utils/dimensions';
import {fontFamily} from '../../../utils/functions';

import AccountItem from './AccountItem';
import SocialMediaBottomSheet from 'src/component/BottomSheet/SocialMediaBottomSheet';
interface ConnectedAccountsScreenProps {}

const items: any = [
  {id: '1', title: PROFILE.INSTAGRAM, image: IMAGES.profileInsta},
  {id: '2', title: PROFILE.TIKTOK, image: IMAGES.profileTiktok},
  {id: '3', title: PROFILE.FACEBOOK, image: IMAGES.profileFacebook},
  {id: '4', title: PROFILE.LINKEDIN, image: IMAGES.profileLinkedIn},
  {id: '5', title: PROFILE.X, image: IMAGES.profileX},
  {id: '6', title: PROFILE.YOUTUBE, image: IMAGES.profileYoutube},
  {id: '7', title: PROFILE.SNAPCHAT, image: IMAGES.profileSnapchat},
];

interface ConfigData{
    logo:string;
    title:string;
    subTitle:string;
    connectButtonText:string;
    connectBtnBackground:string;
} 

const ConnectedAccountsScreen: React.FC<ConnectedAccountsScreenProps> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const instaBottomSheetRef = useRef<any>(null);
  const socialMediaBottomSheetRef = useRef<any>(null);
  //   const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const [selectedItem, setSelectedItem] = useState<any>(); // Initialize with birthday from Redux
  const [configData, setConfigData] = useState<ConfigData>({logo:'',
    title:'',
    subTitle:'',
    connectButtonText:'',
    connectBtnBackground:''});
  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  const getSelectedItem = (item: any) => {
    setSelectedItem(item);
    console.log('itemseleted', item);
    switch(item.title){
       case PROFILE.INSTAGRAM :socialMediaBottomSheetRef.current.open();
         setConfigData({
            logo:IMAGES.profileInsta,
            title:PROFILE.INSTAGRAM,
            subTitle:'',
            connectButtonText:PROFILE.CONNECT_INSTAGRAM,
            connectBtnBackground:COLORS.pink
         })
    //    break;
    //    case PROFILE.TIKTOK :socialMediaBottomSheetRef?.current?.open();
    //    break;
    //    case PROFILE.INSTAGRAM :instaBottomSheetRef.current.open();
    //    break;
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
            title={configData.title}
            submitButtonText={configData.connectButtonText}
            
            buttonStyle={{backgroundColor: COLORS.black}}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onConfirm}
      />
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
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listContainer: {
    marginVertical: 16,
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 13,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
    marginBottom: 16,
  },
});
export default ConnectedAccountsScreen;

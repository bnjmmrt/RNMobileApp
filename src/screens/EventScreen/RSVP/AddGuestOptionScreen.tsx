import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import TabBar from '../../../component/ActiveTabBar/TabBar';
import BackButton from '../../../component/BackButton/BackButton';
import Button from '../../../component/Button';

import { BUTTON_LABLE, COLORS, LABLE } from '../../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import IMAGES from '@images/index';
import AddFromContacts from './AddFromContacts';
import AddGuestScreen from './AddGuestScreen';
import GuestForm from './GuestForm';
import { addGuest } from 'src/redux/slices/rspvSlice';
import { useDispatch } from 'react-redux';

interface EmailPhoneScreenProps extends NativeStackScreenProps<any, any> { }

const AddGuestOptionScreen: React.FC<EmailPhoneScreenProps> = ({

}) => {
  const [currentTab, setCurrentTab] = useState('01');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const [URL, setURL] = useState('');
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    URL.length > 0 && bottomSheetRef?.current?.open();
  }, [URL]);

  const setWebUrl = (url: string) => {
    setURL(url);
  };

  const onNextClick = () => {
    if (currentTab == '01') {
      phoneNumberInputRef.current &&
        phoneNumberInputRef.current.handleNextPress();
    } else {
      emailInputRef.current && emailInputRef.current.handleNextPress();
    }
  };

  const handleBackPress = () => navigation.goBack();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );
  const handleSyncContacts = () => {
    console.log('Sync contacts tapped');
    navigation.navigate('AddGuestScreen');
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle={LABLE.ADD_GUEST}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <View style={styles.contentContainer}>
        <Title subTitle={LABLE.ADD_A_PHOTO_SUBTITLE} align='center' />
        <TabBar
          onTabChange={handleTabChange}
          tabOneLabel="Add from Contacts"
          tabTwoLabel="Add Manualy"
        />
        {currentTab == '01' ? <AddFromContacts /> : <GuestForm onSubmit={(e) => {
          dispatch(addGuest(e))
          navigation.pop(1);
        }} />}
        {/* <View style={styles.contactContainer}>
          <Image
            source={IMAGES.noRecord}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>{LABLE.ADD_FRIEND_AS_GUEST}</Text>
          <Text style={styles.subtitle}>{LABLE.ADD_GUEST_SYNC_TEXT}</Text>

          <TouchableOpacity style={styles.button} onPress={handleSyncContacts}>
            <Image source={IMAGES.settings} />
            <Text style={styles.buttonText}>
              {LABLE.SYNC_CONTACT_SEETTINGS}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: verticalMarginScale(8),
  },
  spacer: {
    flex: 1,
  },

  contactContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: horizontalScale(100),
    height: verticalScale(100),
    marginBottom: verticalMarginScale(24),
  },
  title: {
    color: COLORS.black,
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.black,
    height: verticalScale(40),
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(14),
    borderRadius: radiusScale(25),
    marginTop: verticalMarginScale(16),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: fontScale(14),
    paddingLeft: verticalMarginScale(6),
  },
});
export default AddGuestOptionScreen;

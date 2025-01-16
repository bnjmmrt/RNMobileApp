import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, LABLE, PROFILE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import ProfileScreenStyle from './ProfileScreenStyle';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import ProfileTopView from './ProfileTopView';
import ProfileListItem from './ProfileListItem';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { Text } from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';

// Define the type for navigation props
interface ProfileScreenProps extends NativeStackScreenProps<any, any> { }

interface ListItem {
  id: string;
  title: string;
  image: string
}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const styles = ProfileScreenStyle();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [URL, setURL] = useState('');
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  useEffect(() => {
    URL.length > 0 && setShowBottomSheet(true)
  }, [URL])

  const setWebUrl = (url: string) => {
    setURL(url)
  };
  const onChangeBottomSheet = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  }

  const [isInvited, setInvited] = useState<boolean>(loginData?.isInvited || false)

  const items: ListItem[] = [
    { id: '1', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    { id: '2', title: PROFILE.NOTIFICATION, image: IMAGES.notification },
    { id: '3', title: PROFILE.FEEDBACK, image: IMAGES.feedback },
    { id: '4', title: PROFILE.CONTACT_SUPPORT, image: IMAGES.contact },
    { id: '5', title: PROFILE.DELETE_ACCOUNT, image: '' },

  ];

  useEffect(()=>{
    console.log("Sayyed login Data:",loginData)
  },[loginData])

  const handleLogoutPress = () => {
  };
  return (

    <SafeAreaView style={[styles.container, { backgroundColor: isInvited ? COLORS.black : COLORS.white }]}>
      {isInvited ?
        <BeforeAppStaticComponent
          title={LABLE.STREAMLINE_YOUR_LIFESTYLE}
          subTitle={LABLE.MANAGE_YOUR_EVENTS} />
        :
        <View style={{ backgroundColor: COLORS.white }}>

          <HeaderComponent />
          <ScrollView>

            <ProfileTopView />

            {items.map((item) => {
              return <ProfileListItem
                key={item.id}
                item={item} />
            })}

            <TermsAndPolicy setUrl={setWebUrl} type='small' showMessage={false} />

            <TouchableOpacity onPress={() => handleLogoutPress()}>
              <Text style={styles.textBelowStyle}>{PROFILE.LOGOUT}</Text>
            </TouchableOpacity>
          </ScrollView>

          {showBottomSheet && <WebViewBottomSheet url={URL} onChange={onChangeBottomSheet} />}

        </View>
      }

    </SafeAreaView>
  );
};

export default ProfileScreen;

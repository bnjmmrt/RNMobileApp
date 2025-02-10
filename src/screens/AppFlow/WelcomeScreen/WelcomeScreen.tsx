import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WelcomeScreenStyles from './WelcomeScreenStyles';
import {COLORS, BUTTON_LABLE, LABLE} from '../../../utils/constants';
import IMAGES from '../../../assets/images';
import Button from '../../../component/Button';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {apiPost, apiPut} from '../../../ApiManager/MainApi';

const WelcomePage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const navigation = useNavigation<any>();
  const styles = WelcomeScreenStyles();
  const loginData = useSelector((state: any) => state.auth.loginData);

  const openCommunityGuidelines = () => {
    console.log('openCommunityGuidelines');
  };

  const onEnterClick = () => {
    navigation.navigate('AppStack', {screen: 'BottomTabBar'});
  };

  console.log(loginData);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await apiPost('/auth/get-user-with-roles-by-id', {
          id: loginData.id,
        });

        setUserName(res.data.data.name);

        await apiPut(`/auth/user/${loginData.id}/set-login-status`, {
          id: loginData.id,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [loginData.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgCon}>
        <Image
          style={[styles.imgStyle]}
          source={IMAGES.rumorLogoDark}
          tintColor={COLORS.black}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{LABLE.WELCOME}</Text>
        <View>
          <Text style={styles.subtitle}>
            Hey {userName}, {LABLE.WELCOME_NOTE_LINE_1}
          </Text>
          <Text style={styles.subtitle}>
            {LABLE.WELCOME_NOTE_LINE_2}{' '}
            <Text
              style={[styles.subtitle, {textDecorationLine: 'underline'}]}
              onPress={openCommunityGuidelines}>
              Community Guidelines
            </Text>{' '}
            to ensure the best experience for everyone.
          </Text>
          <Text style={styles.subtitle}>{LABLE.WELCOME_NOTE_LINE_3}</Text>
        </View>
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.ENTER}
        colorTheme={'light'}
        onPress={onEnterClick}
      />
    </SafeAreaView>
  );
};

export default WelcomePage;

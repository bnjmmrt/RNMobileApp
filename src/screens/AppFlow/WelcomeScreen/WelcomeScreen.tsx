import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreenStyles from './WelcomeScreenStyles';
import { COLORS, BUTTON_LABLE, LABLE } from '../../../utils/constants';
import IMAGES from '../../../assets/images';
import Button from '../../../component/Button';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { apiPost, apiPut } from '../../../ApiManager/MainApi';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { RootState } from 'src/redux/slices';
import { ROUTES } from 'src/navigation/Route';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const styles = WelcomeScreenStyles();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const root = useRoute();

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.BLACK_SCHEME);
    }, []),
  );


  const openCommunityGuidelines = () => {
    console.log('openCommunityGuidelines');
  };

  const updateUserStatus = async () => {
    try {

      await apiPut(`/auth/user/${userId}/set-login-status`, {
        id: userId,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const onEnterClick = () => {
    updateUserStatus()
    navigation.navigate('AppStack', { screen: ROUTES.BottomTabBar });
  };

  return (
    <View style={styles.container}>
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
            Hey {root?.params?.userName}, {LABLE.WELCOME_NOTE_LINE_1}
          </Text>
          <Text style={styles.subtitle}>
            {LABLE.WELCOME_NOTE_LINE_2}{' '}
            <Text
              style={[styles.subtitle, { textDecorationLine: 'underline' }]}
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
    </View>
  );
};

export default WelcomeScreen;

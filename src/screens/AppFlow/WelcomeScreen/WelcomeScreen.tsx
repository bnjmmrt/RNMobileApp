import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreenStyles from './WelcomeScreenStyles';
import { COLORS, BUTTON_LABLE, LABLE } from '../../../utils/constants';
import IMAGES from '../../../assets/images';
import Button from '../../../component/Button';
import { useSelector } from 'react-redux';

const WelcomePage:React.FC<{navigation: any}> = ({ navigation }) => {
  const styles = WelcomeScreenStyles();
  const loginData = useSelector((state: any) => state.auth.loginData);
  const userName = 'Zohan Khan';
  const openCommunityGuidelines = () => {
    console.log('openCommunityGuidelines');
  };

  console.log("loginData: ", loginData)

  console.log('Navigation Prop:', navigation);
  const onEnterClick = () => {
    navigation.navigate('BottomTabBar');
  };

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
        <Text style={styles.title}>
          {LABLE.WELCOME}
        </Text>
        <View >
          <Text style={styles.subtitle}>
            Hey {userName}, {LABLE.WELCOME_NOTE_LINE_1}
          </Text>
          <Text style={styles.subtitle}>
            {LABLE.WELCOME_NOTE_LINE_2}{' '}
            <Text style={[styles.subtitle, { textDecorationLine: 'underline' }]}
              onPress={openCommunityGuidelines}
            >
              Community Guidelines
            </Text>{' '}
            to ensure the best experience for everyone.
          </Text>
          <Text style={styles.subtitle}>
            {LABLE.WELCOME_NOTE_LINE_3}
          </Text>
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

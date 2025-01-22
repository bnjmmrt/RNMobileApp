import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import Button from '../Button';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { useNavigation } from '@react-navigation/native';

interface BeforeAppStaticComponentProps {
  isChatScreen: boolean;
  showLogout: boolean;
}

const BeforeAppStaticComponent: React.FC<BeforeAppStaticComponentProps> = ({
  isChatScreen = false,
  showLogout = false
}) => {
  const navigation = useNavigation();


  const listData = [
    { id: 0, uri: IMAGES.frame1, title: LABLE.ACCESS_THE_MOST_VALUABLE_CALENDAR, subTitle: LABLE.DISCOVER_EXPERIENCES_IN_ART },
    { id: 1, uri: IMAGES.frame2, title: LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS, subTitle: LABLE.CONNECT_WITH_WORLD },
    { id: 2, uri: IMAGES.frame3, title: LABLE.CHAT_WITH_HOST, subTitle: LABLE.CONNECT_DIRECTLY_WITH_PEOPLE },
    { id: 3, uri: IMAGES.frame4, title: LABLE.STREAMLINE_YOUR_LIFESTYLE, subTitle: LABLE.MANAGE_YOUR_EVENTS },
  ];

  const [current, setCurrent] = useState(isChatScreen ? listData[2] : listData[0]);

  const handleImageClick = () => {
    if (isChatScreen) {
      setCurrent(listData[2]);
    } else {
      const nextIndex = (current.id + 1) % listData.length;
      setCurrent(listData[nextIndex]);
    }

  };

  const onButtonClick = () => {
    navigation.navigate('AppFlowStack');
  };

  return (

    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={IMAGES.rumorLogo} style={styles.logoImgStyle} />
        </View>

        <Pressable onPress={handleImageClick}>
          <Image source={current.uri} style={styles.image} />
        </Pressable>

        {!isChatScreen ? (
          <View style={styles.dotContainer}>
            {[4, 6, 8, 6, 4].map((size, index) => (
              <View
                key={index}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: index === 2 ? COLORS.white : COLORS.white,
                  borderRadius: size / 2,
                  marginRight: 8,
                  opacity: index === 2 ? 1 : index === 1 || index === 3 ? 0.5 : 0.2,
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.dotContainer} />
        )}


        <TitleSubtitle
          style={styles.titleSubtitle}
          title={current.title}
          subTitle={current.subTitle}
          titleFontSize={30}
          subTitleMargin={Hp(1)}
          centerTextAlign={true}
          isDarkTheme={true}
        />

        <View style={{ height: Hp(5) }} />

        {!isChatScreen && <Button
          style={styles.btnStyle}
          title={BUTTON_LABLE.APPLY_FOR_MEMBERSHIP}
          colorTheme="light"
          onPress={onButtonClick}
        />}
        {!isChatScreen && <Text style={styles.textBelowStyle}>{LABLE.TWO_MINUTES_TO_COMPLETE}</Text>}
        {isChatScreen && <Text style={styles.textComingSoonStyle}>{LABLE.COMING_SOON}</Text>}
        {showLogout && <Text style={styles.logoutTextStyle}>{LABLE.LOGOUT}</Text>}

      </ScrollView>
    </View>
  );
};

export default BeforeAppStaticComponent;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2
  },
  contentContainer: {
    flex: 1,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center', marginTop: 10, marginBottom: 10
  },
  logoImgStyle: {
    width: 100,
    height: 50,
    resizeMode: 'center',
  },
  textBelowStyle: {
    color: COLORS.light_gray,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
  },
  textComingSoonStyle: {
    color: COLORS.white,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  logoutTextStyle: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: 10,
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    height: Hp(1),
    alignItems: 'center',
  },
  titleSubtitle: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

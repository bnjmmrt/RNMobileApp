import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { fontScale, Hp, verticalMarginScale, verticalScale, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import Button from '../Button';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CustomText } from '../CustomText';
import CustomCarousel from '../Carousel/CarouselComponent';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import FastImage from '@d11/react-native-fast-image';

interface BeforeAppStaticComponentProps {
  isChatScreen: boolean;
}

const BeforeAppStaticComponent: React.FC<BeforeAppStaticComponentProps> = ({
  isChatScreen = false,
}) => {
  const navigation = useNavigation();

  const listData = [
    {
      id: 0,
      uri: IMAGES.frame1,
      title: LABLE.ACCESS_THE_MOST_VALUABLE_CALENDAR,
      subTitle: LABLE.DISCOVER_EXPERIENCES_IN_ART,
    },
    {
      id: 1,
      uri: IMAGES.frame2,
      title: LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS,
      subTitle: LABLE.CONNECT_WITH_WORLD,
    },
    {
      id: 2,
      uri: IMAGES.frame3,
      title: LABLE.CHAT_WITH_HOST,
      subTitle: LABLE.CONNECT_DIRECTLY_WITH_PEOPLE,
    },
    {
      id: 3,
      uri: IMAGES.frame4,
      title: LABLE.STREAMLINE_YOUR_LIFESTYLE,
      subTitle: LABLE.MANAGE_YOUR_EVENTS,
    },
  ];

  const [current, setCurrent] = useState(
    isChatScreen ? listData[2] : listData[0],
  );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  const handleImageClick = (index: number) => {
    console.log('index', index);
    if (isChatScreen) {
      setCurrent(listData[2]);
    } else {
      // const nextIndex = (current.id + 1) % listData.length;
      setCurrent(listData[index]);
    }
  };

  const onButtonClick = () => {
    navigation.navigate('AppFlowStack');
  };

  // const renderImageItem = ({item}:{item:any}) => {
  //   return (
  //     <Pressable onPress={handleImageClick}>
  //       <Image source={item.uri} style={styles.image} />
  //     </Pressable>
  //   )
  // }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={IMAGES.rumorLogo} style={styles.logoImgStyle} />
        </View>

        {!isChatScreen &&
          <CustomCarousel
            list={listData}
            onScroll={handleImageClick}
          />}
        {isChatScreen &&
          <FastImage
            source={listData[2].uri}
            style={styles.chatImage}
          />}

        <TitleSubtitle
          style={styles.titleSubtitle}
          title={current.title}
          subTitle={current.subTitle}
          titleFontSize={fontScale(32)}
          subTitleMargin={verticalMarginScale(8)}
          centerTextAlign={true}
          isDarkTheme={true}
        />

        <View style={{ height: Hp(5) }} />

        {!isChatScreen && (
          <Button
            style={styles.btnStyle}
            title={BUTTON_LABLE.APPLY_FOR_MEMBERSHIP}
            colorTheme="light"
            onPress={onButtonClick}
          />
        )}
        {!isChatScreen && (
          <CustomText style={styles.textBelowStyle}>
            {LABLE.TWO_MINUTES_TO_COMPLETE}
          </CustomText>
        )}
        {isChatScreen && (
          <CustomText style={styles.textComingSoonStyle}>
            {LABLE.COMING_SOON}
          </CustomText>
        )}
      </ScrollView>
    </View>
  );
};

export default BeforeAppStaticComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
  contentContainer: {
    flex: 1,
  },
  btnStyle: {
    width: Wp(85),
    height: verticalScale(56),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: verticalMarginScale(40),
    marginBottom: verticalMarginScale(25),
  },
  logoImgStyle: {
    resizeMode: 'contain',
  },
  textBelowStyle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginVertical: Hp(1),
  },
  textComingSoonStyle: {
    color: COLORS.white,
    fontSize: fontScale(22),
    textAlign: 'center',
    fontFamily: fontFamily.RomieTrial_Bold,
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
  chatImage: {
    height: 329,
    width: 329,
    alignSelf: 'center'
  }
});

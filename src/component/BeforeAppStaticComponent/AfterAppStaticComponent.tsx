import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hp, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import Button from '../Button';
import ImageCarousel from '../ImageCarosuel/ImageCarosuel';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { ScrollView } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../HeaderComponent';

interface AfterAppStaticComponentProps {
  title: string;
  subTitle: string;
}

const AfterAppStaticComponent: React.FC<AfterAppStaticComponentProps> = ({
  title,
  subTitle,
}) => {

  const navigation = useNavigation();

  const onButtonClick = () => {
    navigation.navigate('AppFlowStack');
  }

  return (

    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
      <HeaderComponent />
      <ImageCarousel />
        
        <TitleSubtitle
          style={{ paddingHorizontal: 20, marginTop: 20 }}
          title={title}
          subTitle={subTitle}
          centerTextAlign={true}
          isDarkTheme={true}
        />
        <View style={{ height: Hp(4) }} />

        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.APPLY_FOR_MEMBERSHIP}
          colorTheme={'light'}
          onPress={onButtonClick}
        />
        <Text style={styles.textBelowStyle}>{LABLE.TWO_MINUTES_TO_COMPLETE}</Text>


      </ScrollView>

    </View>
  );
};

export default AfterAppStaticComponent;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black
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
});

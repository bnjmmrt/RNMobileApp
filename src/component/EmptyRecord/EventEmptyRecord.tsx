import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { fontScale, Hp, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { fontFamily } from '../../utils/functions';

interface EventEmptyRecordProps {
  title: string;
  subTitle?: string;
  isLoading?: boolean;
  footerContent?: React.ReactNode;
}

const EventEmptyRecord: React.FC<EventEmptyRecordProps> = ({
  title,
  subTitle,
  isLoading,
  footerContent,
}) => {
  console.log('isLoading', isLoading);

  return !isLoading ? (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={IMAGES.noRecord} style={styles.logoImgStyle} />
      </View>

      <TitleSubtitle
        style={styles.titleSubtitle}
        title={title}
        subTitle={subTitle}
        titleFontSize={fontScale(32)}
        subTitleMargin={Hp(1)}
        centerTextAlign={true}
        isDarkTheme={false}
      />
      {footerContent ? footerContent : null}
    </View>
  ) : (
    <ActivityIndicator color={COLORS.black} />
  );
};

export default EventEmptyRecord;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImgStyle: {
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
    fontSize: fontScale(22),
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
    backgroundColor: COLORS.white,
  },
});

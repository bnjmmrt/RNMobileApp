import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  Wp,
} from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { fontFamily } from '../../utils/functions';
import Button from '../Button';

interface EmptyRecordComponentProps {
  title: string;
  subTitle?: string;
  isLoading?: boolean;
  logo?: string;
  btnShown?: boolean;
  btnIcon?: string;
  onPress?: () => void;
  btnLabel?: string;
}

const EmptyRecordComponent: React.FC<EmptyRecordComponentProps> = ({
  title,
  subTitle,
  isLoading,
  btnIcon,
  btnShown = false,
  onPress,
  btnLabel,
}) => {
  return !isLoading ? (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={IMAGES.noRecord} style={styles.logoImgStyle} />
      </View>

      <TitleSubtitle
        style={styles.titleSubtitle}
        title={title}
        subTitle={subTitle}
        titleFontSize={32}
        subTitleMargin={Hp(1)}
        centerTextAlign={true}
        isDarkTheme={false}
      />
      {btnShown && (
        <Button
          colorTheme="dark"
          title={btnLabel}
          onPress={onPress}
          style={styles.btnStyle}
          imageSource={btnIcon}
        />
      )}
    </View>
  ) : (
    <ActivityIndicator color={COLORS.black} />
  );
};

export default EmptyRecordComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
  },
  contentContainer: {
    flex: 1,
  },
  btnStyle: {
    width: 'auto',
    paddingHorizontal: horizontalMarginScale(20),
    borderRadius: 100,
    marginTop: verticalMarginScale(30),
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
    fontSize: fontScale(14),
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

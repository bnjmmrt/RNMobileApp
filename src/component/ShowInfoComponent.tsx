/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';
import { fontScale, Hp, radiusScale, verticalScale, Wp } from '../utils/dimensions';
import { fontFamily } from '../utils/functions';
import { COLORS } from '../utils/constants';
import { View } from 'react-native-animatable';
import IMAGES from '@images/index';
import { CustomText } from './CustomText';

interface ShowInfoComponentProps {
  title: string;
}

const ShowInfoComponent: React.FC<ShowInfoComponentProps> = ({
  title,
}) => {

  return (
    <View style={{ flexDirection: 'row', borderRadius: 5, backgroundColor: COLORS.bgYellow, padding: 10 }}>
      <Image source={IMAGES.help} style={{ marginRight: 10,resizeMode:'contain' }} />
      <CustomText>{title}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  ShowInfoComponent: {
    height: verticalScale(48),
    borderRadius: radiusScale(99),
    alignItems: 'center',
    justifyContent: 'center',
    width: Wp(90),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  text: {
    marginHorizontal: 10,
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontSize: fontScale(14),
  },
  image: {
    width: Hp(3),
    height: Hp(3),
    resizeMode: 'contain',
  },
});

export default ShowInfoComponent;

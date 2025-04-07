import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import { fontScale, Hp, verticalMarginScale } from '../../utils/dimensions';

interface HeaderProps {
  title?: string;
  subTitle?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLinesTitle?: number;
  numberOfLinesSubtitle?: number;
}

const Header: React.FC<HeaderProps> = ({ title, subTitle, align = 'left', numberOfLinesTitle, numberOfLinesSubtitle }) => {
  return (
    <View style={[styles.container, { alignItems: align }]}>
      {title && <Text numberOfLines={numberOfLinesTitle} style={[styles.title, { textAlign: align }]}>{title}</Text>}
      {subTitle && <Text numberOfLines={numberOfLinesSubtitle} style={[styles.subTitle, { textAlign: align }]}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalMarginScale(10),
  },
  title: {
    color: COLORS.black,
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Medium,
    marginVertical: Hp(1),
    textAlign: 'center', // Default alignment
  },
});

export default Header;

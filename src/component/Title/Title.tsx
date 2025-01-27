import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import { Hp } from '../../utils/dimensions';

interface HeaderProps {
  title: string;
  subTitle?: string;
  align?: 'left' | 'center' | 'right'; 
}

const Header: React.FC<HeaderProps> = ({ title, subTitle, align = 'left' }) => {
  return (
    <View style={[styles.container, { alignItems: align }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    color: COLORS.black,
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center', // Default alignment
  },
});

export default Header;

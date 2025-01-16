import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageSourcePropType, Image, Platform, ImageStyle } from 'react-native';
import { Hp, Wp } from '../utils/dimensions';
import { fontFamily } from '../utils/functions';
import { COLORS } from '../utils/constants';

interface ButtonSmallProps {
  title: string;
  onPress: () => void; // Function called on button press
  style?: StyleProp<ViewStyle>; // Optional custom button styles
  textStyle?: StyleProp<TextStyle>; // Optional custom text styles
  imageSource?: ImageSourcePropType; // Optional image source
  imageStyle?: StyleProp<ViewStyle>;
  rightImageSource?: ImageSourcePropType; // Optional image source
  rightImageStyle?: StyleProp<ImageStyle>;
  leftImageStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  colorTheme?: string;
}

const ButtonSmall: React.FC<ButtonSmallProps> = ({
  title,
  onPress,
  style,
  textStyle,
  colorTheme,
  disabled
}) => {

  const colorbackground =  colorTheme == 'dark' ? COLORS.black: COLORS.white;
  const textColor =  colorTheme == 'dark' ? COLORS.white: COLORS.black;
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button,{backgroundColor: disabled ? COLORS.disable : colorbackground} ,style]} // Merge default and custom styles
      onPress={onPress}
    >
      <Text style={[styles.text,{color: textColor}, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 14,
    fontFamily:fontFamily.ABCDiatype_Bold
  },

});

export default ButtonSmall;

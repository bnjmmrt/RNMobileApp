import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageSourcePropType, Image, Platform, ImageStyle } from 'react-native';
import { Hp, Wp } from '../utils/dimensions';
import { fontFamily } from '../utils/functions';
import { COLORS } from '../utils/constants';

interface ButtonProps {
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

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  leftImageStyle,
  imageSource,
  colorTheme,
  rightImageSource,
  rightImageStyle,
  disabled
}) => {

  const colorbackground = colorTheme == 'dark' ? COLORS.black : COLORS.white;
  const textColor = colorTheme == 'dark' ? COLORS.white : COLORS.black;
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? COLORS.disable : colorbackground }, style]} // Merge default and custom styles
      onPress={onPress}
    >
      {imageSource && <Image source={imageSource} style={[styles.image, leftImageStyle]} />}
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      {rightImageSource && <Image source={rightImageSource} style={[styles.image, rightImageStyle]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: Wp(90),
    alignSelf: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 14,
    marginHorizontal: 10,
    fontFamily: fontFamily.ABCDiatype_Regular
  },
  image: {
    width: Hp(3),
    height: Hp(3),
    resizeMode: 'contain'
  },
});

export default Button;

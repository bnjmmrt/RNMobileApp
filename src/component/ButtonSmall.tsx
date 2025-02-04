import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageSourcePropType, Image, ImageStyle } from 'react-native';
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
  borderType?: 'SOLID' | 'STRIPE'; // Optional border type, default is 'SOLID'
  leftIcon?: ImageSourcePropType; // Optional left icon
  leftIconStyle?: StyleProp<ImageStyle>; // Optional custom style for left icon
}

const ButtonSmall: React.FC<ButtonSmallProps> = ({
  title,
  onPress,
  style,
  textStyle,
  colorTheme,
  disabled,
  borderType = 'SOLID', // Default to 'SOLID'
  leftIcon,
  leftIconStyle,
}) => {

  const colorbackground = colorTheme == 'dark' ? COLORS.black : COLORS.white;
  const textColor = colorTheme == 'dark' ? COLORS.white : COLORS.black;

  // Determine the styles for the background and border
  const buttonBackground = borderType === 'SOLID' ? { backgroundColor: disabled ? COLORS.disable : colorbackground } : {};
  const borderStyle = borderType === 'STRIPE' ? { borderWidth: 2, borderColor: colorbackground } : {};

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        buttonBackground, // Apply background color if SOLID
        borderStyle, // Apply border if STRIPE
        style,
      ]}
      onPress={onPress}
    >
      {/* Conditionally render the left icon if available */}
      {leftIcon && (
        <Image source={leftIcon} style={[styles.icon, leftIconStyle]} />
      )}
      <Text style={[styles.text, { color:borderType==='STRIPE'?colorbackground:textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
  icon: {
    marginRight: 8, // Add space between icon and text
    width: 16, // Default icon size, can be customized
    height: 16, // Default icon size, can be customized
  },
});

export default ButtonSmall;

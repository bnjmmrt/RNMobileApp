import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  Image,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import { horizontalScale, Hp, radiusScale, Wp } from '../utils/dimensions';
import { fontFamily } from '../utils/functions';
import { COLORS } from '../utils/constants';
import { CustomText } from './CustomText';

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
  loading?: boolean;
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
  loading,
}) => {
  const colorbackground = colorTheme == 'dark' ? COLORS.black : COLORS.white;
  const textColor = colorTheme == 'dark' ? COLORS.white : COLORS.black;

  // Determine the styles for the background and border
  const buttonBackground =
    borderType === 'SOLID'
      ? { backgroundColor: disabled ? COLORS.disable : colorbackground }
      : {};
  const borderStyle =
    borderType === 'STRIPE'
      ? { borderWidth: 2, borderColor: colorbackground }
      : {};

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, buttonBackground, borderStyle, style]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator
          color={borderType === 'STRIPE' ? colorbackground : textColor}
        />
      ) : (
        <>
          {leftIcon && (
            <Image source={leftIcon} style={[styles.icon, leftIconStyle]} />
          )}
          <CustomText
            style={[
              styles.text,
              { color: borderType === 'STRIPE' ? colorbackground : textColor },
              textStyle,
            ]}>
            {title}
          </CustomText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radiusScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    minWidth: horizontalScale(65),
  },
  text: {
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  icon: {
    marginRight: 4,
    width: 16,
    height: 16,
  },
});

export default ButtonSmall;

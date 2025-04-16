/* eslint-disable react-native/no-inline-styles */
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
import {
  fontScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../utils/dimensions';
import { fontFamily } from '../utils/functions';
import { COLORS } from '../utils/constants';
import { CustomText } from './CustomText';
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  imageSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ViewStyle>;
  rightImageSource?: ImageSourcePropType;
  rightImageStyle?: StyleProp<ImageStyle>;
  leftImageStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  colorTheme?: string;
  loading?: boolean;
  clearButtonStyle?: StyleProp<ViewStyle>;
  buttonType?: 'stripe';
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
  disabled,
  loading,
  clearButtonStyle,
  buttonType = 'solid',
}) => {
  const colorbackground =
    colorTheme === 'red'
      ? COLORS.errorText
      : colorTheme === 'dark'
      ? COLORS.black
      : COLORS.white;
  const textColor = disabled
    ? COLORS.neutral_disabled
    : buttonType === 'stripe'
    ? COLORS.black
    : colorTheme === 'red'
    ? COLORS.white
    : colorTheme === 'dark'
    ? COLORS.white
    : COLORS.black;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? COLORS.bgGray
            : buttonType === 'stripe'
            ? COLORS.white
            : colorbackground,
          borderWidth: buttonType === 'stripe' ? 2 : 0,
          borderColor: buttonType === 'stripe' ? COLORS.black : 'transparent',
        },
        style,
        clearButtonStyle,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {imageSource && (
            <Image
              source={imageSource}
              style={[styles.image, leftImageStyle]}
            />
          )}
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
          {rightImageSource && (
            <Image
              source={rightImageSource}
              style={[styles.image, rightImageStyle]}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
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
    textAlign: 'center',
    // width: '100%',
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontSize: fontScale(14),
  },
  image: {
    width: Hp(3),
    height: Hp(3),
    resizeMode: 'contain',
  },
});

export default Button;

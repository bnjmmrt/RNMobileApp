import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { fontFamily } from 'src/utils/functions';
import { styles } from './style';
import { fontScale } from 'src/utils/dimensions';

interface CustomTextProps {
  textProps?: TextProps;
  style?: TextStyle | Array<StyleProp<TextStyle>>;
  children?: ReactNode;
  onPress?: () => void;
  defaultFontFamily?: 'abcd' | 'romie';
  noOfLine?: number;
}

export const CustomText = ({
  textProps,
  style,
  children,
  onPress,
  defaultFontFamily = 'abcd',
  noOfLine
}: CustomTextProps): React.JSX.Element => {
  const flattenedStyle = StyleSheet.flatten(style);

  return (
    <Text
      numberOfLines={noOfLine}
      {...textProps}
      style={[
        styles?.customText,
        {
          fontSize:
            flattenedStyle && flattenedStyle?.fontSize
              ? flattenedStyle?.fontSize
              : fontScale(14),
          fontFamily:
            defaultFontFamily === 'abcd'
              ? fontFamily.ABCDiatype_Regular
              : fontFamily.RomieTrial_Regular,
        },
        style,
      ]}
      onPress={onPress}>
      {children}
    </Text>
  );
};

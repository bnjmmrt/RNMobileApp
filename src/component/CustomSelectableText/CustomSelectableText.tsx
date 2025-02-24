import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, LABLE } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

interface CustomSelectableTextProps {
  label?: string;
  errorMessage: string | null;
  // setErrorMessage:(isError:boolean)=>void;
  placeholder?: string; // Optional placeholder for input
  leftImage?: any;
  rightImage?: any;
  onPress?: () => void;
  defaultValue?: string;
  style?: ViewStyle;
}

const CustomSelectableText: React.FC<CustomSelectableTextProps> = ({
  label,
  errorMessage,
  // setErrorMessage,
  placeholder = '',
  leftImage,
  rightImage,
  onPress,
  defaultValue = '',
  style,
}) => {
  // const [errorMessage, setErrorMessage] = useState('');

  return (
    <View style={[styles.container, style]}>
      {/* Dynamic Label */}
      {label && <Text style={[styles.label]}>{label}</Text>}

      {/* Input Field */}
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorInputWrapper : null,
        ]}>
        {leftImage && <Image source={leftImage} style={styles.leftImage} />}

        {defaultValue ? <Text style={[styles.inputText, { width: leftImage ? "90%" : '96.5%' }]}>{defaultValue}</Text> : <Text style={styles.inputTextPlaceholder}>{placeholder}</Text>}

        {rightImage && <Image source={rightImage} style={styles.leftImage} />}
      </TouchableOpacity>

      {/* Dynamic Error Message */}
      {errorMessage ? (
        <Text style={[styles.errorText]}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // marginTop: verticalMarginScale(24),
  },
  label: {
    paddingVertical: verticalMarginScale(2),
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    height: verticalScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(15),
  },
  leftImage: { marginRight: verticalMarginScale(6) },
  inputText: {
    width: '90%',
    fontSize: fontScale(14),
    color: COLORS.black,
  },
  inputTextPlaceholder: {
    width: '95%',
    fontSize: fontScale(14),
    color: COLORS.light_gray,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(56),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default CustomSelectableText;

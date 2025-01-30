import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {COLORS, LABLE} from '../../utils/constants';

interface CustomSelectableTextProps {
  label?: string;
  errorMessage: string | null;
  // setErrorMessage:(isError:boolean)=>void;
  placeholder?: string; // Optional placeholder for input
  leftImage?: any;
  rightImage?: any;
  onPress?: () => void;
  defaultValue?: string;
  style?:ViewStyle
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
  style
}) => {
  // const [errorMessage, setErrorMessage] = useState('');

  return (
    <View style={[styles.container,style]}>
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
        
          {defaultValue ? <Text style={styles.inputText}>{defaultValue}</Text> : <Text style={styles.inputTextPlaceholder}>{placeholder}</Text>}
        
        {rightImage && <Image  source={rightImage} style={styles.leftImage} />}
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
    marginTop: 24,
  },
  label: {
    paddingVertical: 2,
    fontSize: 14,
    // color: COLORS.labelGray,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  leftImage: {marginRight: 6, width: 16, 
    height: 16, },
  inputText: {
    width: '90%',
    fontSize: 14,
    color: COLORS.black,
  },
  inputTextPlaceholder: {
    width: '90%',
    fontSize: 14,
    color: COLORS.light_gray,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

export default CustomSelectableText;

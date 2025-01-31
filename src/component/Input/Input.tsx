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
import { COLORS } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { fontFamily } from 'src/utils/functions';

interface InputProps {
  label?: string;
  errorMessage: string;
  placeholder?: string;
  leftImage?: any;
  rightImage?: any;
  onPressImage?: () => void;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  otherStyle?: ViewStyle;
  editable?: boolean
}

const Input = forwardRef((props: InputProps, ref) => {
  const {
    label,
    errorMessage: initialErrorMessage,
    placeholder = '',
    leftImage,
    rightImage,
    onPressImage,
    multiline = false,
    defaultValue = '',
    onChangeText,
    otherStyle,
    height = 60,
    editable
  } = props;

  const [inputText, setInputText] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  // Expose handleNextPress to the parent
  useImperativeHandle(ref, () => ({
    handleNextPress,
    validateInputs,
    inputText,
    setErrorMessage,
  }));

  // Validate inputs
  const validateInputs = () => {
    if (!inputText) {
      setErrorMessage(initialErrorMessage);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Handle the "Next" button press
  const handleNextPress = () => {
    if (validateInputs()) {
      // navigation.navigate('VerifyOtpScreen', { email: inputText, isEmail: true });
    }
  };

  return (
    <View style={[styles.container, otherStyle]}>
      {/* Dynamic Label */}
      {label && <Text style={[styles.label]}>{label}</Text>}

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          multiline ? styles.multilineInputContainer : null,
          errorMessage ? styles.errorInputWrapper : null,
          { height: height }
        ]}>
        {leftImage && <Image source={leftImage} style={styles.leftImage} />}
        <TextInput
          {...props}
          editable={editable}
          style={[styles.input, multiline ? styles.multilineInput : null]}
          value={inputText}
          placeholder={placeholder}
          onChangeText={text => {
            setInputText(text);
            setErrorMessage(''); // Clear error on text change
            if (onChangeText) {
              onChangeText(text); // Call the parent-provided onChangeText if it exists
            }
          }}
          multiline={multiline}
        />
        {rightImage && (
          <TouchableOpacity onPress={onPressImage}>
            <Image source={rightImage} style={styles.rightImage} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dynamic Error Message */}
      {errorMessage ? (
        <Text style={[styles.errorText]}>{errorMessage}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 24,
  },
  label: {
    paddingVertical: 2,
    fontSize: 14,
    // color: COLORS.labelGray,
    fontFamily: fontFamily.ABCDiatype_Medium
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  multilineInputContainer: {
    height: 160, // Adjust height for multiline inputs
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  leftImage: { width: 16, height: 16 },
  rightImage: { width: 16, height: 16 },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top', // Ensures text starts at the top for multiline
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

export default Input;

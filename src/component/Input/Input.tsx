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
import {COLORS} from '../../utils/constants';
import {useNavigation} from '@react-navigation/native';

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
        ]}>
        {leftImage && <Image source={leftImage} style={styles.leftImage} />}
        <TextInput
          {...props}
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
            <Image source={rightImage} style={styles.leftImage} />
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
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  multilineInputContainer: {
    height: 160, // Adjust height for multiline inputs
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  leftImage: {marginRight: 6, width: 20, height: 20},
  input: {
    width: '90%',
    fontSize: 16,
    color: COLORS.black,
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

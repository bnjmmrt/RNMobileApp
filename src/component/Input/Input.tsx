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
import {CustomText} from '../CustomText';
import {fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale} from 'src/utils/dimensions';

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
      {label && <CustomText style={[styles.label]}>{label}</CustomText>}

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
    marginTop: verticalMarginScale(24),
  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    color: COLORS.black,
    fontSize:fontScale(14),
    fontWeight:'500'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    height: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(16),
  },
  multilineInputContainer: {
    height: verticalScale(160), // Adjust height for multiline inputs
    alignItems: 'flex-start',
    paddingTop: verticalMarginScale(10),
  },
  leftImage: {marginRight: horizontalMarginScale(6), width:horizontalMarginScale(20), height: verticalMarginScale(20)},
  input: {
    width: '90%',
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight:'500'
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
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default Input;

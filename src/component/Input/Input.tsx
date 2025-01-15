import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils/constants';
import {useNavigation} from '@react-navigation/native';

interface InputProps {
  label?: string;
  errorMessage: string;
  placeholder?: string; // Optional placeholder for input
  leftImage?: any;
  rightImage?: any;
  onPressImage?:()=>void
}

const Input = forwardRef((props: InputProps, ref) => {
  const {
    label,
    errorMessage: initialErrorMessage,
    placeholder = '',
    leftImage,
    rightImage,
    onPressImage
  } = props;

  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  // Expose handleNextPress to the parent
  useImperativeHandle(ref, () => ({
    handleNextPress,
  }));

  // Validate inputs
  const validateInputs = () => {
    console.log('clickeddddddddd');
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
    <View style={styles.container}>
      {/* Dynamic Label */}
      {label && <Text style={[styles.label]}>{label}</Text>}

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorInputWrapper : null,
        ]}>
        {leftImage && <Image source={leftImage} style={styles.leftImage} />}
        <TextInput
          {...props}
          style={styles.input}
          value={inputText}
          placeholder={placeholder}
          // placeholderTextColor={COLORS.placeholderGray}
          onChangeText={text => {
            setInputText(text);
            setErrorMessage(''); // Clear error on text change
          }}
          // onBlur={validateInputs}
        />
        {rightImage &&   (<TouchableOpacity onPress={onPressImage}><Image source={rightImage} style={styles.leftImage} /></TouchableOpacity>)}
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  leftImage: {marginRight: 6},
  input: {
    width: '90%',
    fontSize: 16,
    color: COLORS.black,
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
  // input: {
  //     flex: 1,
  //     fontSize: 16,
  //     color: COLORS.black,
  // },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

export default Input;

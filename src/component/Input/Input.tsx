import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

interface InputProps {
  label?: string;
  errorMessage: string;
  placeholder?: string;
  leftImage?: any;
  rightImage?: any;
  onPressImage?: () => void;
  defaultValue?: string;
}

const Input = forwardRef((props: InputProps, ref) => {
  const {
    label,
    errorMessage: initialErrorMessage,
    placeholder = '',
    leftImage,
    rightImage,
    onPressImage,
    defaultValue = '',
  } = props;

  const [inputText, setInputText] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState('');

  useImperativeHandle(ref, () => ({
    inputText,
    handleNextPress,
  }));

  const validateInputs = () => {
    if (!inputText) {
      setErrorMessage(initialErrorMessage);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNextPress = () => {
    if (!validateInputs()) return;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorInputWrapper : null,
        ]}
      >
        {leftImage && <Image source={leftImage} style={styles.leftImage} />}
        <TextInput
          style={styles.input}
          value={inputText}
          placeholder={placeholder}
          onChangeText={(text) => {
            setInputText(text);
            setErrorMessage(''); // Clear error on text change
          }}
        />
        {rightImage && (
          <TouchableOpacity onPress={onPressImage}>
            <Image source={rightImage} style={styles.leftImage} />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  label: {
    paddingVertical: 2,
    fontSize: 14,
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
  leftImage: {
    marginRight: 6,
  },
  input: {
    width: '90%',
    fontSize: 16,
    color: COLORS.black,
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

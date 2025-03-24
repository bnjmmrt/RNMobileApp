import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';
import { COLORS, LABLE } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { verticalScale } from 'src/utils/dimensions';
import useKeyboard from 'src/utils/hooks/useKeyboard';

const EmailInput = forwardRef(({ otherStyle }, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const navigation = useNavigation();
  const { updateKeyboardStatus } = useKeyboard(inputRef);

  // Expose handleNextPress to the parent
  useImperativeHandle(ref, () => ({
    handleNextPress,
    validateEmailAddress,
    setEmailAddress,
    emailAddress,
    setDisabled,
    setErrorMessage,
  }));

  // Validate email format
  const validateEmailAddress = () => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    console.log(emailRegex.test(emailAddress));
    if (!emailRegex.test(emailAddress)) {
      setErrorMessage(LABLE.EROOR_ENTER_EMAIL);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Validate email format
  const onchangeValidate = (email: string) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    console.log(emailRegex.test(email));
    if (!emailRegex.test(email)) {
      setErrorMessage(LABLE.EROOR_ENTER_EMAIL);
    } else {
      setErrorMessage('');
    }
  };

  // Handle the "Next" button press
  const handleNextPress = () => {
    if (validateEmailAddress()) {
      navigation.navigate('VerifyOtpScreen', {
        email: emailAddress,
        isEmail: true,
      });
    }
  };

  return (
    <View style={[styles.container, otherStyle]}>
      <View
        style={[
          styles.inputWrapper,
          errorMessage && styles.errorInputWrapper,
          disabled && styles.disabledInput,
        ]}>
        <Image
          source={errorMessage ? IMAGES.email_error : IMAGES.email}
          style={[
            styles.icon,
            {
              tintColor: errorMessage ? COLORS.errorText : COLORS.light_gray,
            },
          ]}
        />

        <TextInput
          ref={inputRef}
          style={[styles.input, disabled && { color: COLORS.light_gray }]}
          placeholder={errorMessage ? '' : 'example@gmail.com'}
          keyboardType="email-address"
          focusable={true} // Enable input focus
          autoCapitalize="none" // Disable automatic capitalization
          autoComplete="off"
          autoCorrect={false}
          autoFocus={true}
          value={emailAddress}
          onChangeText={text => {
            setEmailAddress(text);
            onchangeValidate(text); // Clear error on text change
          }}
          // onBlur={validateEmailAddress}
          editable={!disabled}
          onFocus={() => {
            updateKeyboardStatus(true);
          }}
          onBlur={() => {
            updateKeyboardStatus(false);
            validateEmailAddress();
          }}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(56),
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
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
  disabledInput: {
    backgroundColor: COLORS.lighter_gray,
    color: COLORS.dark_gray,
  },
});

export default EmailInput;

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ViewStyle,
  KeyboardTypeOptions,
  ImageStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, ERROR_MESSAGE } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { CustomText } from '../CustomText';
import { fontFamily } from 'src/utils/functions';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { regexForLettersAndCharacters } from 'src/utils/validationRegex';

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
  editable?: boolean;
  isRequired?: boolean;
  forBottomSheet?: boolean;
  inputFieldContainerStyle?: ViewStyle;
  keyboardType?: KeyboardTypeOptions;
  blurOnSubmit?: any;
  customRightImageStyle?: ImageStyle;
  customLeftImageStyle?: ImageStyle;
  extraInputProps?: TextInputProps;
  labelStyle?: any;
  placeholderTextColor?: string;
  maxLength?: number;
  hasDropdown?: boolean;
  isBackgroundRed?: boolean;
  hasHandler?: boolean;
  isName?: boolean;
  isEmail?: boolean;
  isUrl?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type InputRefMethods = {
  handleNextPress: () => void;
  validateInputs: () => boolean;
  inputText: string;
  inputRef: React.RefObject<TextInput>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
};

const Input = forwardRef<InputRefMethods, InputProps>((props, ref) => {
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
    editable = true,
    isRequired = false,
    forBottomSheet = false,
    inputFieldContainerStyle,
    keyboardType = 'default',
    blurOnSubmit = true,
    customLeftImageStyle,
    customRightImageStyle,
    extraInputProps,
    labelStyle,
    maxLength,
    hasDropdown = false,
    isBackgroundRed = false,
    hasHandler = false,
    isName = false,
    isEmail = false,
    isUrl = false,
    onBlur,
    onFocus,
    placeholderTextColor,
  } = props;

  const inputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null);
  const { updateKeyboardStatus } = useKeyboard(textInputRef);

  const [inputText, setInputText] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  // Expose handleNextPress to the parent
  useImperativeHandle(ref, () => ({
    handleNextPress,
    validateInputs,
    inputText,
    inputRef,
    setErrorMessage,
    setInputText,
  }));

  const validateName = (name: string) => {
    const regex = regexForLettersAndCharacters;

    if (!name) {
      setErrorMessage(initialErrorMessage);
      return false;
    }

    if (!regex.test(name)) {
      setErrorMessage(ERROR_MESSAGE.INVALID_CHARACTERS);
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const validateEmail = (email: string) => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!email) {
      setErrorMessage(initialErrorMessage);
      return false;
    }

    if (!regex.test(email)) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_A_VALID_EMAIL_ADDRESS);
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const validateWebUrl = (webUrl: string) => {
    const urlRegex =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?$/;

    if (!webUrl) {
      setErrorMessage(initialErrorMessage);
      return false;
    }

    if (!urlRegex.test(webUrl)) {
      setErrorMessage(ERROR_MESSAGE.WEBSITE_ERROR);
      return false;
    }

    setErrorMessage('');
    return true;
  };
  const checkValidation = (name: string) => {
    if (!inputText) {
      setErrorMessage(initialErrorMessage);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Validate inputs
  const validateInputs = () => {
    console.log('Updated Text:', inputText);
    return isName
      ? validateName(inputText)
      : isEmail
      ? validateEmail(inputText)
      : isUrl
      ? validateWebUrl(inputText)
      : checkValidation(inputText);
  };

  // Handle the "Next" button press
  const handleNextPress = () => {
    validateInputs();
  };

  const requiredText = () =>
    isRequired && (
      <CustomText style={{ color: COLORS.errorText }}> *</CustomText>
    );

  useEffect(() => {
    if (defaultValue != undefined && defaultValue != null) {
      setInputText(defaultValue);
    }
  }, [defaultValue]);

  const InputWrapper = onPressImage ? TouchableOpacity : View;

  const InputComponent = forBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <View style={[styles.container, otherStyle]}>
      {/* Dynamic Label */}
      {label && (
        <CustomText style={[styles.label, labelStyle]}>
          {label}
          {requiredText()}
        </CustomText>
      )}

      {/* Input Field */}
      <InputWrapper
        ref={inputRef}
        onPress={onPressImage}
        style={[
          styles.inputContainer,
          multiline ? styles.multilineInputContainer : null,
          errorMessage
            ? multiline
              ? [styles.errorInputWrapper, styles.multilineInputContainer]
              : styles.errorInputWrapper
            : null,

          inputFieldContainerStyle,
          !hasDropdown && {
            backgroundColor: !editable
              ? COLORS.borderGray
              : errorMessage
              ? COLORS.bgRed
              : COLORS.white,
          },
          isBackgroundRed && [styles.errorInputWrapper],
        ]}>
        {leftImage && (
          <Image
            source={leftImage}
            style={[styles.leftImage, customLeftImageStyle]}
          />
        )}
        <InputComponent
          {...props}
          ref={textInputRef}
          onPress={onPressImage}
          activeOpacity={onPressImage ? 0.7 : 1}
          blurOnSubmit={blurOnSubmit}
          editable={editable}
          style={[
            styles.input,
            multiline ? styles.multilineInput : null,
            { color: editable ? COLORS.black : COLORS.neutral_disabled },
          ]}
          value={inputText}
          placeholder={placeholder}
          onChangeText={text => {
            setInputText(text);
            isName
              ? validateName(text)
              : isEmail
              ? validateEmail(text)
              : isUrl
              ? validateWebUrl(text)
              : setErrorMessage('');
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          multiline={multiline}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => {
            updateKeyboardStatus(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            updateKeyboardStatus(false);
            if (onBlur) onBlur();
          }}
          placeholderTextColor={placeholderTextColor || COLORS.placeHodler}
          {...extraInputProps}
        />
        {hasHandler && (
          <View style={styles.resizeHandle}>
            <Image
              style={{ width: 10, height: 10 }}
              resizeMode="contain"
              source={IMAGES.Handler}
            />
          </View>
        )}

        {rightImage && (
          <TouchableOpacity onPress={onPressImage}>
            <Image
              source={rightImage}
              style={[styles.rightImage, customRightImageStyle]}
            />
          </TouchableOpacity>
        )}
      </InputWrapper>

      {/* Dynamic Error Message */}
      {errorMessage ? (
        <CustomText style={[styles.errorText]}>{errorMessage}</CustomText>
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
    paddingBottom: 2,
    color: COLORS.black,
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 56,
  },
  multilineInputContainer: {
    height: 160,
    paddingTop: 10,
  },
  leftImage: { width: 16, height: 16 },
  rightImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    left: 10,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
    height: 56,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
  resizeHandle: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    padding: 2,
  },
});

export default Input;

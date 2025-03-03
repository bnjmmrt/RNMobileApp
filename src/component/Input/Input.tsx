import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
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
import { COLORS } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { CustomText } from '../CustomText';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

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
}

export type InputRefMethods = {
  handleNextPress: () => void;
  validateInputs: () => boolean;
  inputText: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
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
    labelStyle
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
    setInputText,
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
  const requiredText = () =>
    isRequired && (
      <CustomText style={{ color: COLORS.errorText }}> *</CustomText>
    );

  useEffect(() => {
    if (defaultValue != undefined && defaultValue != null) {
      setInputText(defaultValue);
    }
  }, [defaultValue]);

  const InputComponent = forBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <View style={[styles.container, otherStyle]}>
      {/* Dynamic Label */}
      {label && (
        <CustomText style={[styles.label, labelStyle]} >
          {label}
          {requiredText()}
        </CustomText>
      )}

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          multiline ? styles.multilineInputContainer : null,
          errorMessage
            ? multiline
              ? [styles.errorInputWrapper, styles.multilineInputContainer]
              : styles.errorInputWrapper
            : null,
          inputFieldContainerStyle,
          { backgroundColor: !editable ? COLORS.borderGray : errorMessage ? COLORS.bgRed : COLORS.white }
        ]}>
        {leftImage && (
          <Image
            source={leftImage}
            style={[styles.leftImage, customLeftImageStyle]}
          />
        )}
        <InputComponent
          {...props}
          blurOnSubmit={blurOnSubmit}
          editable={editable}
          style={[styles.input, multiline ? styles.multilineInput : null, { color: editable ? COLORS.black : COLORS.neutral_disabled }]}
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
          keyboardType={keyboardType}
          {...extraInputProps}
        />
        {rightImage && (
          <TouchableOpacity onPress={onPressImage}>
            <Image
              source={rightImage}
              style={[styles.rightImage, customRightImageStyle]}
            />
          </TouchableOpacity>
        )}
      </View>

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
    marginTop: verticalMarginScale(24),
  },
  label: {
    paddingBottom: horizontalMarginScale(2),
    color: COLORS.black,
    fontSize: fontScale(14),
    lineHeight: 16,
    marginBottom: 2,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(12),
    height: verticalScale(56),
  },
  multilineInputContainer: {
    height: verticalScale(160),
    paddingTop: verticalMarginScale(10),
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
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
    height: verticalScale(56),
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default Input;

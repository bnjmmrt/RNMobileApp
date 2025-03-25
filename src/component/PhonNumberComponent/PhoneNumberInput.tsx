import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import parsePhoneNumberFromString, {
  CountryCode,
  getExampleNumber,
  isValidPhoneNumber,
} from 'libphonenumber-js';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'react-native-animatable';
import { useDispatch } from 'react-redux';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import IMAGES from '../../assets/images';
import {
  setCountryCallingCode,
  setCountryCodeFlag,
} from '../../redux/slices/appFlowSlice';
import { COLORS, LABLE } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { BottomSheetMethods } from '../BottomSheet/BottomSheet';
import { CustomText } from '../CustomText';
import CountryPickerBottomSheet from './CountryPickerBottomSheet';

type TranslatedNames = Record<string, string>;

export type countryType = {
  code: string;
  dial_code: string;
  flag: string;
  name: TranslatedNames;
};

export type PhoneNumberInputRefMethods = {
  handleNextPress: () => void;
  validatePhoneNumber: (errorMsg?: string) => boolean;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setCallingCode: React.Dispatch<React.SetStateAction<string>>;
  setFlag: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  callingCode: string;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setCode: React.Dispatch<React.SetStateAction<CountryCode>>;
};

const PhoneNumberInput = forwardRef<
  PhoneNumberInputRefMethods,
  {
    label?: string;
    otherStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    onChangeText?: (text: string) => void;
    onSelectCountry?: (selectedCountry: any) => void;
    forBottomSheet?: boolean;
    // errorMsg?:string | null
  }
>(
  (
    {
      label,
      otherStyle,
      inputContainerStyle,
      onChangeText,
      onSelectCountry,
      forBottomSheet = false,
      // errorMsg=null
    },
    ref,
  ) => {
    const inputRef = useRef<TextInput>(null);
    const countryPickerRef = useRef<BottomSheetMethods>(null);
    const { updateKeyboardStatus } = useKeyboard(inputRef);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [callingCode, setCallingCode] = useState('+1');
    const [code, setCode] = useState<CountryCode>('US');
    const [flag, setFlag] = useState('🇺🇸');
    const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState();
    const [maxLength, setMaxLength] = useState(12);

    const handleCountrySelect = (selectedCountry: any) => {
      setFlag(selectedCountry.flag);
      setCode(selectedCountry.code);
      setCallingCode(selectedCountry.dial_code);
      setSelectedCountry(selectedCountry);

      setPhoneNumber('');
      dispatch(setCountryCallingCode(selectedCountry.callingCode));
      dispatch(setCountryCodeFlag(selectedCountry.flag));
      setMaxLength(getMaxPhoneNumberLength(selectedCountry.dial_code));
      if (onSelectCountry) {
        onSelectCountry(selectedCountry);
      }

      closeCountryModal();
    };

    const closeCountryModal = () => {
      countryPickerRef?.current?.close();
    };

    useImperativeHandle(ref, () => ({
      handleNextPress,
      validatePhoneNumber,
      setPhoneNumber,
      setCallingCode,
      setFlag,
      phoneNumber,
      callingCode,
      setDisabled,
      setErrorMessage,
      setCode,
    }));

    const validatePhoneNumber = (errorMsg?: string) => {
      console.log('errorMsg', errorMsg);

      if (phoneNumber != '') {
        const mobileNumber = `${callingCode}${phoneNumber}`;
        const isValid = isValidPhoneNumber(mobileNumber, code);
        if (!isValid) {
          setErrorMessage(LABLE.EROOR_ENTER_VALID_PHONE_NUMBER);
          return false;
        }
      } else {
        setErrorMessage(errorMsg ? errorMsg : LABLE.EROOR_ENTER_PHONE_NUMBER);
        return false;
      }
      setErrorMessage('');
      return true;
    };

    const handleNextPress = () => {
      if (validatePhoneNumber()) {
        navigation.navigate('VerifyOtpScreen', {
          phone: `${callingCode} ${phoneNumber}`,
          isEmail: false,
        });
        // Alert.alert("Success!!", `Phone Number: ${callingCode} ${phoneNumber}`);
      }
    };

    const getMaxPhoneNumberLength = (countryCode: any) => {
      try {
        const exampleNumber = getExampleNumber(countryCode);
        return exampleNumber ? exampleNumber.nationalNumber.length : 10; // Default to 10 if no example found
      } catch (error) {
        return 10; // Fallback max length
      }
    };
    const handleChange = (text: any) => {
      // Remove non-numeric characters except "+"
      const cleanedText = text.replace(/\D/g, '');

      // Ensure that text is not empty
      if (!cleanedText) {
        setPhoneNumber('');
        return;
      }

      // Combine with country code
      const fullNumber = `${callingCode}${cleanedText}`;
      console.log('Full Number:', fullNumber);

      // Parse the number
      let parsedNumber = parsePhoneNumberFromString(fullNumber);
      console.log(parsedNumber);
      if (parsedNumber && parsedNumber.isValid()) {
        setPhoneNumber(
          parsedNumber.formatInternational().replace(`${callingCode} `, ''),
        ); // Remove country code from input
      } else {
        setPhoneNumber(cleanedText); // Keep raw input if invalid
      }
    };

    const InputComponent = forBottomSheet ? BottomSheetTextInput : TextInput;

    // Function to format the phone number with spaces for display
    const formatPhoneNumber = (number: string) => {
      return number.replace(/(\d{3})(?=\d)/g, '$1 ').trim(); // Format input (add space after every 3 digits)
    };

    const handlePhoneNumberChange = (text: string) => {
      // Remove spaces for validation purposes
      const cleanedText = text.replace(/\s/g, '');

      // Dynamically calculate max length to include spaces
      const newMaxLength = maxLength + Math.floor(cleanedText.length / 3); // Add space after every 3 digits

      if (cleanedText.length <= newMaxLength) {
        setPhoneNumber(cleanedText); // Update raw phone number state without spaces
        handleChange(cleanedText); // Update state or validation

        // Reset error message when editing
        setErrorMessage('');
        if (onChangeText) {
          onChangeText(cleanedText); // Pass cleaned input to onChangeText
        }
      }
    };
    useEffect(() => {
      handleCountrySelect({
        code: 'US',
        dial_code: '+1',
        flag: '🇺🇸',
        name: {
          ar: 'الولايات المتحدة الأمريكية',
          bg: 'Съединени щати',
          by: 'Злучаныя Штаты',
          cn: '美国',
          cz: 'Spojené státy',
          da: 'USA',
          de: 'Vereinigte Staaten',
          ee: 'Ühendriigid',
          el: 'Ηνωμένες Πολιτείες Αμερικής',
          en: 'United States',
          es: 'Estados Unidos',
          fr: 'États-Unis',
          he: 'ארצות הברית',
          it: 'stati Uniti',
          jp: 'アメリカ',
          nl: 'Verenigde Staten',
          pl: 'Stany Zjednoczone',
          pt: 'Estados Unidos',
          ro: 'Statele Unite',
          ru: 'Соединенные Штаты',
          tr: 'Amerika Birleşik Devletleri',
          ua: 'Сполучені Штати',
          zh: '美國',
        },
      });
    }, []);

    return (
      <View style={[styles.container, otherStyle]}>
        {/* Dynamic Label */}
        {label && <CustomText style={[styles.label]}>{label}</CustomText>}
        <View
          style={[
            errorMessage !== ''
              ? styles.errorInputWrapper
              : styles.inputWrapper,
            disabled && styles.disabledInput,
            inputContainerStyle,
          ]}>
          <TouchableOpacity
            style={[styles.flagContainer]}
            onPress={() => countryPickerRef?.current?.open()}
            disabled={disabled}>
            <Text style={styles.flag}>{flag}</Text>
            {!disabled && (
              <Image
                source={IMAGES.upDownArrow}
                style={[styles.arrowIcon, disabled && { opacity: 0.5 }]}
              />
            )}
            <Text style={styles.callingCode}>{callingCode}</Text>
          </TouchableOpacity>

          <InputComponent
            ref={inputRef}
            // style={styles.input}
            style={[styles.input, disabled && { color: COLORS.light_gray }]}
            // placeholder="Enter phone number"
            keyboardType="number-pad"
            returnKeyType="done"
            value={phoneNumber}
            // maxLength={maxLength}
            // onChangeText={handleChange}
            // onChangeText={(text: string) => {
            //   handleChange(text);
            //   setErrorMessage('');
            //   if (onChangeText) {
            //     onChangeText(text);
            //   }
            // }}
            // value={formatPhoneNumber(phoneNumber)}
            maxLength={maxLength + Math.floor(phoneNumber.length / 3)}
            onChangeText={handlePhoneNumberChange}
            onFocus={() => {
              updateKeyboardStatus(true);
            }}
            onBlur={() => {
              updateKeyboardStatus(false);
              validatePhoneNumber();
            }}
            editable={!disabled}
          />
        </View>

        {errorMessage ? (
          <CustomText style={styles.errorText}>{errorMessage}</CustomText>
        ) : null}

        <CountryPickerBottomSheet
          ref={countryPickerRef}
          pickerButtonOnPress={handleCountrySelect}
          closeCountryModal={closeCountryModal}
          selectedCountry={selectedCountry}
          lang="en"
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    color: COLORS.black,
    fontSize: fontScale(14),
    fontWeight: '500',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  inputWrapper: {
    height: verticalScale(56),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorInputWrapper: {
    height: verticalScale(56),
    borderWidth: 1,
    borderColor: COLORS.borderRed,
    borderRadius: 10,
    backgroundColor: COLORS.bgRed,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 18,
    width: 25,
    textAlign: 'center',
    height: 25,
  },
  arrowIcon: {
    marginRight: 5,
  },
  callingCode: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
    paddingHorizontal: 5,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
  disabledInput: {
    backgroundColor: COLORS.lighter_gray,
  },
});

export default PhoneNumberInput;

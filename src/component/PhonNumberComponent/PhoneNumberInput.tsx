import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import parsePhoneNumberFromString, { CountryCode, isValidPhoneNumber, AsYouType, formatNumber, parseNumber, formatIncompletePhoneNumber, getExampleNumber } from 'libphonenumber-js';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
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
import IMAGES from '../../assets/images';
import { CountryPicker } from '../../component/PhonNumberComponent/CountryPicker';
import {
  setCountryCallingCode,
  setCountryCodeFlag,
} from '../../redux/slices/appFlowSlice';
import { COLORS, LABLE } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { CustomText } from '../CustomText';

type TranslatedNames = Record<string, string>;

export type countryType = {
  code: string;
  dial_code: string;
  flag: string;
  name: TranslatedNames;
};

export type PhoneNumberInputRefMethods = {
  handleNextPress: () => void;
  validatePhoneNumber: () => boolean;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setCallingCode: React.Dispatch<React.SetStateAction<string>>;
  setFlag: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  callingCode: string;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
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
    },
    ref,
  ) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callingCode, setCallingCode] = useState('+1');
    const [code, setCode] = useState<CountryCode>('US');
    const [flag, setFlag] = useState('🇺🇸');
    const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [maxLength,setMaxLength] = useState(12)
    const handleCountrySelect = (selectedCountry: any) => {
      setPhoneNumber('')
      console.log(selectedCountry)
      dispatch(setCountryCallingCode(selectedCountry.callingCode));
      dispatch(setCountryCodeFlag(selectedCountry.flag));
      setFlag(selectedCountry.flag);
      setCode(selectedCountry.code);
      setCallingCode(selectedCountry.dial_code);
      setCountryPickerVisible(false);
      setFlag(selectedCountry.flag);
      setCode(selectedCountry.code);
      setCallingCode(selectedCountry.dial_code);
      setSelectedCountry(selectedCountry)
      setMaxLength(getMaxPhoneNumberLength(selectedCountry.dial_code))
      setCountryPickerVisible(false);
      if (onSelectCountry) {
        onSelectCountry(selectedCountry);
      }
    };

    const closeCountryModal = () => {
      setCountryPickerVisible(false);
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
    }));

    const validatePhoneNumber = () => {
      const mobileNumber = `${callingCode}${phoneNumber}`;
      const isValid = isValidPhoneNumber(mobileNumber, code);
      if (!isValid) {
        setErrorMessage(LABLE.EROOR_ENTER_PHONE_NUMBER);
        return false;
      }
      setErrorMessage('');
      return true;
    };

    const handleNextPress = () => {
      if (validatePhoneNumber()) {
        navigation.navigate('VerifyOtpScreen', {
          phone: `${callingCode}${phoneNumber}`,
          isEmail: false,
        });
        // Alert.alert("Success!!", `Phone Number: ${callingCode} ${phoneNumber}`);
      }
    };

    const getMaxPhoneNumberLength = (countryCode:any) => {
      try {
        const exampleNumber = getExampleNumber(countryCode);
        return exampleNumber ? exampleNumber.nationalNumber.length : 10; // Default to 10 if no example found
      } catch (error) {
        return 10; // Fallback max length
      }
    };
    const handleChange = (text:any) => {
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
    console.log(parsedNumber)
      if (parsedNumber && parsedNumber.isValid()) {
        setPhoneNumber(parsedNumber.formatInternational().replace(`${callingCode} `, '')); // Remove country code from input
      } else {
        setPhoneNumber(cleanedText); // Keep raw input if invalid
      }
    };

    const InputComponent = forBottomSheet ? BottomSheetTextInput : TextInput;

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
            onPress={() => setCountryPickerVisible(true)}
            disabled={disabled}>
            <Text style={styles.flag}>{flag}</Text>
            <Image
              source={IMAGES.upDownArrow}
              style={[styles.arrowIcon, disabled && { opacity: 0.5 }]}
            />
            <Text style={styles.callingCode}>{callingCode}</Text>
          </TouchableOpacity>

          <InputComponent
            // style={styles.input}
            style={[styles.input, disabled && { color: COLORS.light_gray }]}
            // placeholder="Enter phone number"
            keyboardType="phone-pad"
            returnKeyType="done"
            value={phoneNumber}
            maxLength={maxLength}
            // onChangeText={handleChange}
            onChangeText={(text: string) => {
              handleChange(text)
              setErrorMessage('');
              if (onChangeText) {
                onChangeText(text);
              }
            }}
            onBlur={validatePhoneNumber}
            editable={!disabled}
          />
        </View>

        {errorMessage ? (
          <CustomText style={styles.errorText}>{errorMessage}</CustomText>
        ) : null}

        <CountryPicker
          style={styles.countryPicker}
          pickerButtonOnPress={handleCountrySelect}
          closeCountryModal={closeCountryModal}
          show={isCountryPickerVisible}
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
    fontSize: 22,
    width: 25,
    textAlign: 'center',
    height: 25,
  },
  arrowIcon: {
    marginHorizontal: 10,
  },
  callingCode: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
  countryPicker: {
    modal: {
      height: Hp(80),
      backgroundColor: COLORS.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    textInput: {
      backgroundColor: 'white',
      borderColor: COLORS.borderGray,
      borderWidth: 1,
      borderRadius: 10,
      height: 50,
    },
  },
});

export default PhoneNumberInput;

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Image } from 'react-native-animatable';
import { CountryPicker } from "../../component/PhonNumberComponent/CountryPicker";
import IMAGES from '../../assets/images';
import { LABLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import {
    CountryCode,
    isValidPhoneNumber,
  } from 'libphonenumber-js'
  
import { useNavigation } from '@react-navigation/native';
import { Hp } from '../../utils/dimensions';

const PhoneNumberInput = forwardRef((_, ref) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callingCode, setCallingCode] = useState('+1');
    const [code, setCode] = useState<CountryCode>('US');
    const [flag, setFlag] = useState('🇺🇸');
    const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation=useNavigation()
    const handleCountrySelect = (selectedCountry: any) => {
        setFlag(selectedCountry.flag);
        setCode(selectedCountry.code);
        setCallingCode(selectedCountry.dial_code);
        setCountryPickerVisible(false);
    };

    useImperativeHandle(ref, () => ({
        handleNextPress,
    }));

    const validatePhoneNumber = () => {
        const mobileNumber = `${callingCode}${phoneNumber}`
        const isValid = isValidPhoneNumber(mobileNumber, code)
        if(!isValid){
            setErrorMessage(LABLE.EROOR_ENTER_PHONE_NUMBER);
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleNextPress = () => {
        if (validatePhoneNumber()) {
            navigation.navigate('VerifyOtpScreen', { phone: `${callingCode}${phoneNumber}` , isEmail: false})
            // Alert.alert("Success!!", `Phone Number: ${callingCode} ${phoneNumber}`);
        }
    };

    return (
        <View style={styles.container}>
            <View style={errorMessage!== '' ? styles.errorInputWrapper : styles.inputWrapper}>
                <TouchableOpacity
                    style={styles.flagContainer}
                    onPress={() => setCountryPickerVisible(true)}
                >
                    <Text style={styles.flag}>{flag}</Text>
                    <Image source={IMAGES.upDownArrow} style={styles.arrowIcon} />
                    <Text style={styles.callingCode}>{callingCode}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    maxLength={12}
                    onChangeText={(text) => {
                        setPhoneNumber(text);
                        setErrorMessage('');
                    }}
                    onBlur={validatePhoneNumber}
                />
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <CountryPicker
                style={styles.countryPicker}
                pickerButtonOnPress={handleCountrySelect}
                show={isCountryPickerVisible}
                lang="en"
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    inputWrapper: {
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.borderGray,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorInputWrapper: {
        height: 60,
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
        fontFamily:fontFamily.ABCDiatype_Regular
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily:fontFamily.ABCDiatype_Regular,
        color: COLORS.black,
        paddingHorizontal: 5,
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        color: COLORS.errorText,
        fontFamily:fontFamily.ABCDiatype_Regular,
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

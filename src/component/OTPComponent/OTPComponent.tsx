import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { LABLE, BUTTON_LABLE, COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

type OTPComponentProps = {
    performCodeVerification: (code: string) => void;
    resendVerificationCode: (isResend: boolean) => void;
};

type OTPComponentHandle = {
    handleNextPress: () => void;
};

const OTPComponent = forwardRef<OTPComponentHandle, OTPComponentProps>((props, ref) => {
    const [code, setCode] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useImperativeHandle(ref, () => ({ handleNextPress,validateCode, showInvalidCodeError }));

    const validateCode = (): boolean => {
        if (code.length < 4) {
            setErrorMessage(LABLE.EROOR_ENTER_CODE);
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const showInvalidCodeError = (message: string): void =>{
        setErrorMessage(message);
    }

    const handleNextPress = (): void => {
        if (validateCode()) {
            props.performCodeVerification(code);
        }
    };

    const onResendPress = (): void => {
        props.resendVerificationCode(true);
    };


    return (
        <View style={styles.container}>
            <OtpInput
                numberOfDigits={4}
                focusColor="green"
                autoFocus={false}
                hideStick={true}
                placeholder="000000"
                blurOnFilled={true}
                type="numeric"
                secureTextEntry={false}
                focusStickBlinkingDuration={500}
                onFocus={() => console.log("Focused")}
                onBlur={() => console.log("Blurred")}
                onTextChange={(text: string) => {
                    setCode(text);
                    setErrorMessage('');
                }}
                onFilled={(text: string) => console.log(`OTP is ${text}`)}
                textInputProps={{ accessibilityLabel: "One-Time Password" }}
                theme={{
                    containerStyle: styles.container,
                    pinCodeContainerStyle: errorMessage ? styles.pinCodeContainerError : styles.pinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                }}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.resendContainer}>
                <Text style={styles.dontGetCodeText}>{LABLE.DONT_GET_CODE}</Text>
                <TouchableOpacity style={styles.resendButton} onPress={onResendPress}>
                    <Text style={styles.resendText}>{BUTTON_LABLE.RESEND}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        fontFamily: fontFamily.ABCDiatype_Regular,
        color: COLORS.errorText,
    },
    dontGetCodeText: {
        fontSize: 12,
        fontFamily: fontFamily.ABCDiatype_Regular,
        marginEnd: 5,
        color: COLORS.black,
    },
    resendText: {
        fontSize: 12,
        fontFamily: fontFamily.ABCDiatype_Bold,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: COLORS.black,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
    },
    resendButton: {
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: 20,
    },
    activePinCodeContainer: {
        borderColor: COLORS.black,
    },
    pinCodeText: {
        fontSize: 16,
    },
    pinCodeContainer: {
        flex: 1,
        marginLeft: 5,
    },
    pinCodeContainerError: {
        flex: 1,
        borderColor: COLORS.borderRed,
        marginRight: 5,
        backgroundColor: COLORS.bgRed,
    },
});

export default OTPComponent;

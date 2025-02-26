import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { LABLE, BUTTON_LABLE, COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { CustomText } from '../CustomText';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

type OTPComponentProps = {
  performCodeVerification: (code: string) => void;
  resendVerificationCode: (isResend: boolean) => void;
  error?:string

};

type OTPComponentHandle = {
  handleNextPress: () => void;
};

const OTPComponent = forwardRef<OTPComponentHandle, OTPComponentProps>(
  (props, ref) => {
    const [code, setCode] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const otpInput = useRef(null);

    const setApiError = (error: string) => {
      setErrorMessage(error)
    }

    useImperativeHandle(ref, () => ({
      code,
      handleNextPress,
      validateCode,
      showInvalidCodeError,
      clearOTP,
      setApiError
    }));

    const clearOTP = () => {
      otpInput.current.clear(); // Clears the OTP input
    };

    const validateCode = (): boolean => {
      if (code.length < 4) {
        setErrorMessage(LABLE.EROOR_ENTER_CODE);
        return false;
      }
      // if (props.error != '') {
      //   setErrorMessage(LABLE.INVALID_OTP);
      //   return false;
      // }
      setErrorMessage('');
      return true;
    };

    const showInvalidCodeError = (message: string): void => {
      setErrorMessage(message);
    };

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
          ref={otpInput}
          numberOfDigits={4}
          focusColor="green"
          autoFocus={false}
          hideStick={true}
          placeholder="000000"
          blurOnFilled={true}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFocus={() => console.log('Focused')}
          onBlur={() => console.log('Blurred')}
          onTextChange={(text: string) => {
            setCode(text);
            setErrorMessage('');
          }}
          onFilled={(text: string) => console.log(`OTP is ${text}`)}
          textInputProps={{ accessibilityLabel: 'One-Time Password' }}
          theme={{
            containerStyle: styles.container,
            pinCodeContainerStyle: errorMessage
              ? styles.pinCodeContainerError
              : styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
        {errorMessage && (
          <CustomText style={styles.errorText}>{errorMessage}</CustomText>
        )}

        <View style={styles.resendContainer}>
          <CustomText style={styles.dontGetCodeText}>
            {LABLE.DONT_GET_CODE}
          </CustomText>
          <TouchableOpacity style={styles.resendButton} onPress={onResendPress}>
            <CustomText style={styles.resendText}>
              {BUTTON_LABLE.RESEND}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: 5,
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.errorText,
  },
  dontGetCodeText: {
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginEnd: 5,
    color: COLORS.black,
  },
  resendText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Bold,
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(12),
    color: COLORS.black,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalMarginScale(24),
    gap: horizontalMarginScale(8),
  },
  resendButton: {
    borderWidth: 2,
    borderColor: COLORS.black,
    borderRadius: radiusScale(99),
  },
  activePinCodeContainer: {
    borderColor: COLORS.black,
  },
  pinCodeText: {
    fontSize: fontScale(16),
    color: COLORS.black,
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

import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import EmailInput from '../../component/EmailComponent/EmailInput';
import PhoneNumberInput from '../../component/PhonNumberComponent/PhoneNumberInput';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import { BUTTON_LABLE, LABLE, COLORS } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { verticalMarginScale, horizontalMarginScale } from 'src/utils/dimensions';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import IMAGES from '@images/index';
import { fontFamily } from 'src/utils/functions';

const InfoBanner = ({ message }: { message: string }) => (
  <View style={styles.infoBannerContainer}>
    <Image
      resizeMode="contain"
      source={IMAGES.info}
      tintColor={COLORS.blueDark}
      style={styles.infoIcon}
    />
    <Text style={styles.infoText}>{message}</Text>
  </View>
);

interface SecondaryEmailPhoneScreenProps extends NativeStackScreenProps<any, any> {}

interface EmailInputRef {
  handleNextPress: () => void;
  validateEmailAddress: () => boolean;
  setEmailAddress: (email: string) => void;
  emailAddress: string;
  setDisabled: (disabled: boolean) => void;
  setErrorMessage: (error: string) => void;
}

interface PhoneNumberInputRef {
  handleNextPress: () => void;
  validatePhoneNumber: (errorMsg?: string) => boolean;
  setPhoneNumber: (phone: string) => void;
  setCallingCode: (code: string) => void;
  setFlag: (flag: string) => void;
  phoneNumber: string;
  callingCode: string;
  setDisabled: (disabled: boolean) => void;
  setErrorMessage: (error: string) => void;
  setCode: (code: string) => void;
}

const SecondaryEmailPhoneScreen: React.FC<SecondaryEmailPhoneScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();
  const phoneNumberInputRef = useRef<PhoneNumberInputRef>(null);
  const emailInputRef = useRef<EmailInputRef>(null);
  const isEmail = route.params?.isEmail;

  const onNextClick = () => {
    if (isEmail) {
      emailInputRef.current && emailInputRef.current.handleNextPress();
    } else {
      phoneNumberInputRef.current && phoneNumberInputRef.current.handleNextPress();
    }
  };

  const handleBackPress = () => navigation.goBack();

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  const title = isEmail ? LABLE.ENTER_YOUR_EMAIL : LABLE.ENTER_YOUR_PHONE_NUMBER;
  const subTitle = isEmail
    ? LABLE.RUMOR_WILL_SEND_YOU_A_EMAIL_WITH_A_VERIFICATION_CODE
    : LABLE.RUMOR_WILL_SEND_YOU_A_TEXT_WITH_A_VERIFICATION_CODE;

  return (
    <View style={styles.container}>
      <BackButton onPress={handleBackPress} />
      <View style={styles.contentContainer}>
        <TitleSubtitle title={title} subTitle={subTitle} />

        {isEmail ? (
          <EmailInput ref={emailInputRef} otherStyle={{ marginTop: 12 } as ViewStyle} />
        ) : (
          <PhoneNumberInput
            ref={phoneNumberInputRef}
            otherStyle={{ marginTop: 12 } as ViewStyle}
          />
        )}

        <InfoBanner
          message={
            isEmail
              ? 'If you were invited to an event via text, please log in with your phone number—not your email address.'
              : 'If you were invited to an event via email, please log in with that email address—not your phone number.'
          }
        />

        <View style={styles.spacer} />

        {!keyboardVisible ? (
          <Button
            disabled={false}
            style={{
              width: '100%',
              maxWidth: 393,
              marginBottom: BOTTOM_SAFEAREA_SPACING,
            }}
            title={BUTTON_LABLE.NEXT}
            colorTheme="dark"
            onPress={onNextClick}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    alignSelf: 'center',
    maxWidth: 526,
    width: '100%',
    marginHorizontal: 0,
    paddingTop: verticalMarginScale(16),
    paddingBottom: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(20),
  },
  spacer: {
    flex: 1,
  },
  infoBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.bgBlue,
    paddingVertical: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    marginTop: verticalMarginScale(24),
  },
  infoIcon: {
    width: 16,
    height: 16,
    color: COLORS.blueDark,
  },
  infoText: {
    flex: 1,
    color: COLORS.black,
    fontSize: 14,
    marginLeft: horizontalMarginScale(8),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default SecondaryEmailPhoneScreen; 
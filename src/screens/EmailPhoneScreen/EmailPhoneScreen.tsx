import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import TabBar from '../../component/ActiveTabBar/TabBar';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import EmailInput from '../../component/EmailComponent/EmailInput';
import PhoneNumberInput from '../../component/PhonNumberComponent/PhoneNumberInput';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { BUTTON_LABLE, LABLE, COLORS } from '../../utils/constants';
import EmailPhoneStyles from './EmailPhoneStyles';
import { useDispatch, useSelector } from 'react-redux';
import { resetAppFlowDetails } from 'src/redux/slices/appFlowSlice';
import {
  verticalMarginScale,
  horizontalMarginScale,
} from 'src/utils/dimensions';
import { RootState } from 'src/redux/slices';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import IMAGES from '@images/index';
import { fontFamily } from 'src/utils/functions';

const InfoBanner = ({ message }: { message: string }) => (
  <View style={styles.infoBannerContainer}>
    <Image source={IMAGES.info} style={styles.infoIcon} />
    <Text style={styles.infoText}>{message}</Text>
  </View>
);

interface EmailPhoneScreenProps extends NativeStackScreenProps<any, any> {}

const EmailPhoneScreen: React.FC<EmailPhoneScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { keyboardVisible } = useKeyboard();
  const styles = EmailPhoneStyles();
  const [currentTab, setCurrentTab] = useState('01');
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const [URL, setURL] = useState('');
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  dispatch(resetAppFlowDetails());

  useEffect(() => {
    URL.length > 0 && bottomSheetRef?.current?.open();
  }, [URL]);

  const setWebUrl = (url: string) => {
    setURL(url);
    url && bottomSheetRef?.current?.open();
  };

  const onNextClick = () => {
    if (currentTab == '01') {
      phoneNumberInputRef.current &&
        phoneNumberInputRef.current.handleNextPress();
    } else {
      emailInputRef.current && emailInputRef.current.handleNextPress();
    }
  };

  const handleBackPress = () => navigation.goBack();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  const title =
    currentTab == '01' ? LABLE.ENTER_YOUR_PHONE_NUMBER : LABLE.ENTER_YOUR_EMAIL;
  const subTitle =
    currentTab == '01'
      ? LABLE.RUMOR_WILL_SEND_YOU_A_TEXT_WITH_A_VERIFICATION_CODE
      : LABLE.RUMOR_WILL_SEND_YOU_A_EMAIL_WITH_A_VERIFICATION_CODE;

  return (
    <View style={styles.container}>
      <BackButton onPress={handleBackPress} />
      <TabBar
        tab={'01'}
        onTabChange={handleTabChange}
        tabOneLabel="Phone"
        tabTwoLabel="Email"
      />
      <View style={styles.contentContainer}>
        <TitleSubtitle title={title} subTitle={subTitle} />

        {currentTab == '01' ? (
          <PhoneNumberInput
            ref={phoneNumberInputRef}
            otherStyle={{ marginTop: 12 }}
          />
        ) : (
          <EmailInput ref={emailInputRef} otherStyle={{ marginTop: 12 }} />
        )}

        <InfoBanner message="If you have already been invited to an event via email, make sure to login using the email address associated, not your mobile number." />

        <View style={styles.spacer} />

        {!keyboardVisible ? (
          <>
            <TermsAndPolicy
              setUrl={setWebUrl}
              type="large"
              showMessage={true}
            />
            <Button
              disabled={false}
              style={{
                width: '100%',
                marginBottom: BOTTOM_SAFEAREA_SPACING,
              }}
              title={BUTTON_LABLE.NEXT}
              colorTheme="dark"
              onPress={onNextClick}
            />
          </>
        ) : null}
      </View>
      <WebViewBottomSheet url={URL} ref={bottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...EmailPhoneStyles(),
  infoBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    // borderWidth: 1,
    backgroundColor: COLORS.blueDark,
    // borderColor: COLORS.borderGray,
    paddingVertical: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(24),
    marginTop: verticalMarginScale(24),
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: horizontalMarginScale(8),
    color: COLORS.light_gray,
  },
  infoText: {
    flex: 1,
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default EmailPhoneScreen;

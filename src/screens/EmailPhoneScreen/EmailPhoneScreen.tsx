import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import TabBar from '../../component/ActiveTabBar/TabBar';
import BackButton from '../../component/BackButton/BackButton';
import Button from '../../component/Button';
import EmailInput from '../../component/EmailComponent/EmailInput';
import PhoneNumberInput from '../../component/PhonNumberComponent/PhoneNumberInput';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import TitleSubtitle from '../../component/TitleSubTitleComponent/TitleSubtitle';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { BUTTON_LABLE, LABLE } from '../../utils/constants';
import EmailPhoneStyles from './EmailPhoneStyles';

interface EmailPhoneScreenProps extends NativeStackScreenProps<any, any> { }

const EmailPhoneScreen: React.FC<EmailPhoneScreenProps> = ({ navigation }) => {
  const styles = EmailPhoneStyles();
  const [currentTab, setCurrentTab] = useState('01');
  const phoneNumberInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const [URL, setURL] = useState('');
  const bottomSheetRef = useRef(null);

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
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
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
        onTabChange={handleTabChange}
        tabOneLabel="Phone"
        tabTwoLabel="Email"
      />
      <View style={styles.contentContainer}>
        <TitleSubtitle title={title} subTitle={subTitle} />

        {currentTab == '01' ? (
          <PhoneNumberInput ref={phoneNumberInputRef} />
        ) : (
          <EmailInput ref={emailInputRef} />
        )}

        <View style={styles.spacer} />
        <TermsAndPolicy setUrl={setWebUrl} type="large" showMessage={true} />
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.NEXT}
          colorTheme="dark"
          onPress={onNextClick}
        />
      </View>
      <WebViewBottomSheet url={URL} ref={bottomSheetRef} />
    </View>
  );
};

export default EmailPhoneScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE } from '../../utils/constants';
import EmailPhoneStyles from './EmailPhoneStyles';
import TabBar from '../../component/ActiveTabBar/TabBar';
import BackButton from '../../component/BackButton/BackButton';
import PhoneNumberInput from '../../component/PhonNumberComponent/PhoneNumberInput';
import Button from '../../component/Button';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import EmailInput from '../../component/EmailComponent/EmailInput';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';

interface EmailPhoneScreenProps extends NativeStackScreenProps<any, any> { }

const EmailPhoneScreen: React.FC<EmailPhoneScreenProps> = ({ navigation }) => {
    const styles = EmailPhoneStyles();
    const [currentTab, setCurrentTab] = useState('01');
    const phoneNumberInputRef = useRef<any>(null);
    const emailInputRef = useRef<any>(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [URL, setURL] = useState('');

    useEffect(() => {
        URL.length > 0 && setShowBottomSheet(true)
    }, [URL])

    const setWebUrl = (url: string) => {
        setURL(url)
    };
    const onChangeBottomSheet = (index: number) => {
        if (index === -1) {
            setShowBottomSheet(false);
        }
    }

    const onNextClick = () => {
        if (currentTab == '01') {
            phoneNumberInputRef.current && phoneNumberInputRef.current.handleNextPress();
        } else {
            emailInputRef.current && emailInputRef.current.handleNextPress();
        }
    };

    const handleBackPress = () => navigation.goBack();

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    };
    const title = currentTab == '01' ? LABLE.ENTER_YOUR_PHONE_NUMBER : LABLE.ENTER_YOUR_EMAIL
    const subTitle = currentTab == '01' ? LABLE.RUMOR_WILL_SEND_YOU_A_TEXT_WITH_A_VERIFICATION_CODE : LABLE.RUMOR_WILL_SEND_YOU_A_EMAIL_WITH_A_VERIFICATION_CODE
    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={handleBackPress} />
            <TabBar onTabChange={handleTabChange} tabOneLabel="Phone" tabTwoLabel="Email" />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subTitle}</Text>

                {currentTab == '01' ?
                    <PhoneNumberInput ref={phoneNumberInputRef} />
                    :
                    <EmailInput ref={emailInputRef} />}

                <View style={styles.spacer} />
                <TermsAndPolicy setUrl={setWebUrl} />
                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={BUTTON_LABLE.NEXT}
                    colorTheme="dark"
                    onPress={onNextClick}
                />
            </View>
            {showBottomSheet && <WebViewBottomSheet url={URL} onChange={onChangeBottomSheet} />}

        </SafeAreaView>
    );
};

export default EmailPhoneScreen;


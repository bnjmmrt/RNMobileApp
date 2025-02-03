import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    TouchableOpacity,
} from 'react-native';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input from 'src/component/Input/Input';
import { BUTTON_LABLE, COLORS } from 'src/utils/constants';
import { Wp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import RequestVouch from './RequestVouch';
import useContactPermission from 'src/utils/hooks/useContactPermission';

const guestList = [
    { id: 0, label: 'No Guests' },
    { id: 1, label: '1 Guest' },
    { id: 2, label: '2 Guests' },
    { id: 3, label: '3 Guests' },
    { id: 4, label: '4 Guests' },
];

const questionsArray = [
    { id: 1, text: 'Have you attended one of our events in the past, if so - which?' },
    { id: 2, text: 'Any guest references that are currently attending?' },
    { id: 3, text: 'Any other comments....' }
];

const RSPVScreen = () => {
    const bottomSheetRef = useRef(null);
    const inputRefs = useRef({});
    const [errors, setErrors] = useState({});
    const [selectedGuests, setSelectedGuests] = useState('No Guests');
    const [activeView, setActiveTab] = useState('');
    const { requestContactPermission } = useContactPermission();

    const validateInputs = () => {
        let isValid = true;
        questionsArray.forEach(q => {
            const inputValue = inputRefs.current[q.id]?.inputText;
            if (!inputValue) {
                inputRefs.current[q.id]?.setErrorMessage('This field is required');
                isValid = false;
            }
        });
        return isValid;
    };

    const renderApplicationSubmitted = () => {
        return (
            <View>
                <CustomText style={styles.successText}>{`Your application
has been submitted!`}</CustomText>
                <View style={styles.yellowBox}>
                    <Image source={IMAGES.loader} style={{ width: 15, height: 15 }} />
                    <CustomText style={styles.waitingText}>Awaiting response from host</CustomText>
                </View>
                <CustomText style={styles.notificationText}>We’ll notify you when the host makes a decision.</CustomText>
                <View style={styles.boxView}>
                    <CustomText style={styles.boostText}>{`Want to boost your chances of approval? Ask a member
to vouch for you.`}</CustomText>
                    <Button
                        disabled={false}
                        style={styles.requestBtn}
                        title={'Request a Vouch'}
                        colorTheme="dark"
                        onPress={async () => {
                            await requestContactPermission();
                            setActiveTab('vouch')
                        }}
                    />
                </View>
                <Button
                    disabled={false}
                    buttonType='stripe'
                    style={styles.btnStyle}
                    title={'Discover More Events'}
                    colorTheme="dark"
                // onPress={handleInviteLink}
                />
            </View>
        )
    }


    const handleSubmit = () => {
        if (validateInputs()) {
            setActiveTab('submit')
            bottomSheetRef.current.open();
        }
    };
    const renderBottomSheetContent = () => {
        switch (activeView) {
            case 'submit':
                return (
                    renderApplicationSubmitted()
                );
            case 'options':
                return renderOptions();
            case 'vouch':
                return <RequestVouch />

            default:
                return null;
        }
    };
    const getSnapPoints = (): string => {
        switch (activeView) {
            case 'options':
                return '40%';
            case 'submit':
                return '60%';
            default:
                return '85%';
        }
    };
    const renderOptions = () => {
        return guestList.map(item => (
            <TouchableOpacity key={item.id} style={styles.guestButton} onPress={() => { setSelectedGuests(item.label); bottomSheetRef?.current.close() }}>
                <Text style={styles.guestButtonText}>{item.label}</Text>
            </TouchableOpacity>
        ))
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header headerTitle="RSPV" showProgressBar={false} />
            <View style={styles.contentContainer}>
                <View style={styles.eventContainer}>
                    <FastImage source={IMAGES.eventCoverPlaceholders} style={styles.eventImage} />
                    <View>
                        <CustomText style={styles.eventTitle}>Revolve Festival</CustomText>
                        <CustomText style={styles.eventDetails}>Fri, April 13 , 9:00PM - 11:00PM EST</CustomText>
                        <CustomText style={styles.eventDetails}>Los Angeles, California</CustomText>
                    </View>
                </View>
                {questionsArray.map(q => (
                    <Input
                        key={q.id}
                        height={48}
                        ref={ref => (inputRefs.current[q.id] = ref)}
                        label={q.text}
                        errorMessage={errors[q.id]}
                    />
                ))}
                <Input
                    height={48}
                    editable={false}
                    rightImage={IMAGES.downArrow}
                    placeholder={selectedGuests}
                    label="Request access for additional guests?"
                    onPressImage={() => {
                        setActiveTab('options')
                        bottomSheetRef?.current?.open();
                    }}
                />
            </View>
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={BUTTON_LABLE.SUBMTI_APPLICATION}
                colorTheme="dark"
                onPress={handleSubmit}
            />
            <BottomSheetComponent ref={bottomSheetRef} snapPoints={[getSnapPoints()]}>
                <View style={styles.bottomSheetContent}>
                    {renderBottomSheetContent()}
                </View>
            </BottomSheetComponent>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    contentContainer: { padding: 16 },
    eventContainer: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.borderGray, padding: 16, borderRadius: 16, alignItems: 'center', gap: 16 },
    eventImage: { width: 72, height: 104, borderRadius: 8 },
    eventTitle: { fontSize: 24, color: COLORS.black, fontFamily: fontFamily.RomieTrial_Bold },
    eventDetails: { fontSize: 12, color: COLORS.light_gray, fontFamily: fontFamily.ABCDiatype_Medium, marginTop: 8 },
    btnStyle: { borderRadius: 100, marginTop: 'auto' },
    bottomSheetContent: { paddingHorizontal: 12 },
    successText: { fontSize: 32, color: COLORS.black, fontFamily: fontFamily.RomieTrial_Bold, textAlign: 'center' },
    waitingResponseContainer: { flexDirection: 'row', backgroundColor: COLORS.yellowLight, gap: 6, justifyContent: 'center', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, marginTop: 16 },
    boxView: { alignSelf: 'center', borderWidth: 1, marginTop: 28, gap: 16, justifyContent: 'center', borderColor: COLORS.borderGray, borderRadius: 16, padding: 16, marginBottom: 28 },
    loaderIcon: { width: 15, height: 15 },
    waitingText: { fontFamily: fontFamily.ABCDiatype_Medium, color: COLORS.black, fontSize: 14 },
    notificationText: { fontFamily: fontFamily.ABCDiatype_Medium, color: COLORS.light_gray, fontSize: 14, textAlign: 'center', marginTop: 16 },
    guestButton: { borderWidth: 1, borderColor: COLORS.borderGray, borderRadius: 25, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, marginTop: 5 },
    guestButtonText: { fontSize: 14, color: COLORS.black, fontFamily: fontFamily.ABCDiatype_Medium },
    requestBtn: {
        height: 48,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        width: Wp(85),
        alignSelf: 'center',
        flexDirection: 'row'
    },
    boostText: { fontFamily: fontFamily.RomieTrial_Bold, color: COLORS.black, fontSize: 20, textAlign: 'center' },
    yellowBox: { width: 215, alignSelf: 'center', borderWidth: 1, marginTop: 16, flexDirection: 'row', backgroundColor: COLORS.yellowLight, gap: 6, justifyContent: 'center', borderColor: COLORS.borderGray, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8 }
});

export default RSPVScreen;
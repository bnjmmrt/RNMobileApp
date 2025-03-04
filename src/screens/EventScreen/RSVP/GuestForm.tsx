import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    LABLE,
    BUTTON_LABLE,
    ERROR_MESSAGE,
    COLORS,
} from '../../../utils/constants';
import Button from '../../../component/Button';
import Input from '../../../component/Input/Input';
import PhoneNumberInput from 'src/component/PhonNumberComponent/PhoneNumberInput';
import { fontScale, horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import useContacts from 'src/utils/hooks/useContactPermission';

interface GuestFormProps {
    hasPhone: boolean;
    data: {
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        email?: string;
    };
    onSubmit: (values: any) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ hasPhone, data, onSubmit }) => {
    const firstNameRef = useRef<any>(null);
    const lastNameRef = useRef<any>(null);
    const phoneNumberInputRef = useRef<any>(null);
    const emailInputRef = useRef<any>(null);
    const { getPhoneNumber } = useContacts();

    useEffect(() => {
        if (firstNameRef.current) { firstNameRef.current.setInputText(data?.first_name); }
        if (lastNameRef.current) { lastNameRef.current.setInputText(data?.last_name); }
        if (hasPhone && phoneNumberInputRef.current) {
            phoneNumberInputRef.current.setPhoneNumber(getPhoneNumber(data?.phoneNumber).phoneNumber);
            phoneNumberInputRef?.current.setFlag(getPhoneNumber(data?.phoneNumber).flag);
            phoneNumberInputRef?.current.setCallingCode(getPhoneNumber(data?.phoneNumber).countryCode);
            phoneNumberInputRef?.current.setCode(getPhoneNumber(data?.phoneNumber).currentCountry);
            console.log(getPhoneNumber(data?.phoneNumber))

        } else if (emailInputRef.current) {
            emailInputRef.current.setInputText(data?.email);
        }
    }, [data, hasPhone]);

    const handleSubmit = () => {
        const firstNameValid = firstNameRef.current.validateInputs();
        const lastNameValid = lastNameRef.current.validateInputs();
        const phoneOrEmailValid = hasPhone
            ? phoneNumberInputRef.current.validatePhoneNumber()
            : emailInputRef.current.validateInputs();

        const emailValid = !hasPhone && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailInputRef.current.inputText);

        if (firstNameValid && lastNameValid && phoneOrEmailValid ) {
            const filledValues = {
                firstName: firstNameRef.current.inputText,
                lastName: lastNameRef.current.inputText,
                phoneNumber: hasPhone ? '+' + getPhoneNumber(data?.phoneNumber).countryCode + phoneNumberInputRef.current.phoneNumber : '',
                email: hasPhone ? '' : emailInputRef?.current?.inputText,
            };
            onSubmit(filledValues);
        } else {
            if (!emailValid) {
                emailInputRef.current?.setErrorMessage('Please enter a valid email address.');
            }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Input
                    ref={firstNameRef}
                    label={LABLE.FIRST_NAME}
                    errorMessage={ERROR_MESSAGE.FIRST_NAME}
                    labelStyle={{ fontFamily: fontFamily.ABCDiatype_Medium }}
                />
                <Input
                    ref={lastNameRef}
                    label={LABLE.LAST_NAME}
                    errorMessage={ERROR_MESSAGE.LAST_NAME}
                    labelStyle={{ fontFamily: fontFamily.ABCDiatype_Medium }}
                />
                {hasPhone ? (
                    <>
                        <Text style={styles.label}>{LABLE.PHONE_NUMBER}</Text>
                        <PhoneNumberInput ref={phoneNumberInputRef} />
                    </>
                ) : (
                    <Input
                        ref={emailInputRef}
                        label={LABLE.EMAIL}
                        labelStyle={{ fontFamily: fontFamily.ABCDiatype_Medium }}
                        errorMessage={'Please enter an email address in the correct format to continue'}
                    />
                )}
                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={'Add Guest'}
                    colorTheme="dark"
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: horizontalMarginScale(20),
    },
    btnStyle: {
        marginTop: 'auto',
        borderRadius: 100,
    },
    label: {
        fontSize: fontScale(14),
        fontFamily: fontFamily.ABCDiatype_Medium,
        marginTop: verticalMarginScale(20),
    },
});

export default GuestForm;

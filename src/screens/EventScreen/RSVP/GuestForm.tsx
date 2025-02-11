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

interface GuestFormProps {
    hasPhone: boolean;
    data: {
        first_name: string;
        last_name: string;
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

    useEffect(() => {
        if (firstNameRef.current) firstNameRef.current.setInputText(data?.first_name);
        if (lastNameRef.current) lastNameRef.current.setInputText(data?.last_name);
        if (hasPhone && phoneNumberInputRef.current) {
            phoneNumberInputRef.current.setPhoneNumber(data?.phoneNumber);
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

        if (firstNameValid && lastNameValid && phoneOrEmailValid) {
            const filledValues = {
                firstName: firstNameRef.current.inputText,
                lastName: lastNameRef.current.inputText,
                ...(hasPhone
                    ? { phoneNumber: phoneNumberInputRef.current.phoneNumber }
                    : { email: emailInputRef.current.inputText }),
                id: Date.now(),
            };
            onSubmit(filledValues);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Input
                    ref={firstNameRef}
                    label={LABLE.FIRST_NAME}
                    errorMessage={ERROR_MESSAGE.FIRST_NAME}
                />
                <Input
                    ref={lastNameRef}
                    label={LABLE.LAST_NAME}
                    errorMessage={ERROR_MESSAGE.LAST_NAME}
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
                        errorMessage={"Please enter an email address in the correct format to continue"}
                    />
                )}
                <Button
                    disabled={false}
                    style={styles.btnStyle}
                    title={"Add Guest"}
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
        padding: 20,
    },
    btnStyle: {
        marginTop: 'auto',
        borderRadius: 100,
    },
    label: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default GuestForm;